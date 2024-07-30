import {NetManager} from "../service/NetManager";
import {
    AckMessageCode, ListBtAssetsNtfMessage,
    NtfNetMessage,
    ReadBtAssetNtfMessage
} from "../service/NetMessage";
import {BtAssetDetail, BtAssetSummary, ILogicBtConnection, ILogicBtNode} from "./BtLogicDataStructure";
import {IAsyncResult} from "./MethodResult";
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";
import {BtNodeType} from "../common/BtCommon";
import {EditorPosition} from "../common/EditorCommon";


export interface IBtAssetsChangeListener {
    OnBtAssetsListChanged(): void
}

export interface IBtContentChangedListener {
    OnCreateNewNode(nodes: Array<Readonly<ILogicBtNode>>) : void;
    OnNodeLinked(connections: Array<Readonly<ILogicBtConnection>>): void;
    OnRemoveElement(nodeIds: string[], connectionIds: string[]): void;
    OnCurrentEditingBtDocumentChanged(): void
}

export interface IInspectorFocusChangedListener {
    OnInspectorFocusChanged(nodeId: string | null): void;
}



export class BehaviourTreeModel {
    private static _instance : BehaviourTreeModel | null = null;
    private constructor() {
    }

    public static get Instance() : BehaviourTreeModel{
        if(this._instance === null)
        {
            this._instance = new BehaviourTreeModel();
        }
        return this._instance;
    }

    private _isInitialized: boolean = false;
    public Init() : void
    {
        if(!this._isInitialized) {
            NetManager.Instance.RegisterNtfListener("/BehaviourTree/ListAllAssets",
                (ntfMsg) => {
                    this.OnNtfListBehaviourTrees(ntfMsg)
                });
            NetManager.Instance.RegisterNtfListener("/BehaviourTree/ReadBehaviourTree",
                (ntfMsg) => {
                    this.OnNtfReadBehaviourTrees(ntfMsg)
                });
            this._isInitialized = true;
        }
    }


    public async RequestBehaviourTreesAssetsList()
    {
        return NetManager.Instance.SendRequestMessage("/BehaviourTree/ListAllAssets", {} );
    }

    public async RequestSaveCurrentBtDocumentation()
    {
        let path = this._currentEditingBtAssetPath;
        if(path !== null) {
            let opDetail = {
                assetPath : path,
                btContent: this._btAssetsContentMap.get(path)
            }
            let ack = await NetManager.Instance.SendRequestMessage("/BehaviourTree/SaveBehaviourTree", opDetail );
            let result = new Promise<IAsyncResult>((resolve) => {
                resolve({ success: ack.ackCode === AckMessageCode.SUCCESS });
            })
            return result;
        }
        //return
    }

    public async RequestReadBehaviourTree(assetPath: string)
    {
        let opDetail = {
            assetPath : assetPath
        }
        return NetManager.Instance.SendRequestMessage("/BehaviourTree/ReadBehaviourTree", opDetail );
    }

    private _btAssetsList : Array<BtAssetSummary> = [];
    public get BtAssetsList() : ReadonlyArray<Readonly<BtAssetSummary>> { return this._btAssetsList }

    private OnNtfListBehaviourTrees(msg: NtfNetMessage)
    {
        let assetListMsg = msg as ListBtAssetsNtfMessage;
        this._btAssetsList = assetListMsg.ntfOpContent;
        this._btAssetsListener?.OnBtAssetsListChanged();
    }

    private _btAssetsListener: IBtAssetsChangeListener | null = null;
    public RegisterBtAssetsChangeListener(listener: IBtAssetsChangeListener) : void
    {
        this._btAssetsListener = listener;
    }
    public RemoveBtAssetsChangeListener(listener: IBtAssetsChangeListener) : void
    {
        this._btAssetsListener = null;
    }


    // Graphic Edit Implementation
    private _btEditorContentListener: IBtContentChangedListener | null = null;
    public RegisterBtDocumentEditorListener(listener: IBtContentChangedListener) : void {
        this._btEditorContentListener = listener;
    }
    public RemoveBtDocumentEditorListener(listener: IBtContentChangedListener) : void {
        this._btEditorContentListener = null;
    }

    private _btAssetsContentMap : Map<string, BtAssetDetail> = new Map();
    private _currentEditingBtAssetContent : BtAssetDetail | null = null;
    private _currentEditingBtAssetPath: string | null = null;

    private OnNtfReadBehaviourTrees(msg: NtfNetMessage)
    {
        let assetDetailMsg = msg as ReadBtAssetNtfMessage;
        let assetPath = assetDetailMsg.ntfOpContent.assetPath;
        this._btAssetsContentMap.set(assetPath, assetDetailMsg.ntfOpContent);
    }


    public async ChangeEditingBtAsset(path: string) {
        if(this._btAssetsContentMap.has(path)) {
            this.ChangeEditingBtAssetInner(path);
            let result = new Promise<IAsyncResult>((resolve) => {
                resolve({ success: true });
            })
            this._btEditorContentListener?.OnCurrentEditingBtDocumentChanged();
            return result;
        }
        else {
            let netResult = await this.RequestReadBehaviourTree(path);
            if(netResult.ackCode === AckMessageCode.SUCCESS) {
                this.ChangeEditingBtAssetInner(path);
                let result = new Promise<IAsyncResult>((resolve) => {
                    resolve({ success: true });
                })
                this._btEditorContentListener?.OnCurrentEditingBtDocumentChanged();
                return result;
            }
            else {
                let result = new Promise<IAsyncResult>((resolve) => {
                    resolve({ success: false, error: netResult.errInfo });
                })
                return result;
            }
        }
    }

    private ChangeEditingBtAssetInner(path: string) : boolean {
        if(this._currentEditingBtAssetPath === path) {
            return false;
        }
        this._currentEditingBtAssetPath = path;
        this._currentEditingBtAssetContent = this._btAssetsContentMap.get(path)!
        //Check And Repair The Base Data For Adaptable
        if(this._currentEditingBtAssetContent.btNodes === null) {
            this._currentEditingBtAssetContent.btNodes = [];
        }
        if(this._currentEditingBtAssetContent.btNodes.every((n) => n.type !== 'bt_root')) {
            this._currentEditingBtAssetContent.btNodes.push({
                id: generateUniqueID(),
                type: "bt_root",
                position: { x : 100, y: 100 },
                data: {}
            });
        }

        this._currentEditingBtAssetContent.btNodes.forEach((n) => {
            if(n.type == "bt_task") {
                if( n.data.BttType === undefined){
                    n.data.BttType = "BTT_None";
                    this.FillDefaultNodeContentIfPossible(n);
                }
            }
        });

        if(this._currentEditingBtAssetContent.btConnections === null) {
            this._currentEditingBtAssetContent.btConnections = [];
        }
        return true;
    }

    public GetEditingBtAssetContent() : [ Array<ILogicBtNode>, Array<ILogicBtConnection> ] {
        return [this.GetEditingBtAssetContentNodes(), this.GetEditingBtAssetContentConnections()];
    }

    public GetEditingBtAssetContentNodes() : Array<Readonly<ILogicBtNode>> {
        return this._currentEditingBtAssetContent!.btNodes;
    }

    public GetEditingBtAssetContentConnections() : Array<Readonly<ILogicBtConnection>> {
        return this._currentEditingBtAssetContent!.btConnections;
    }


    public MoveNode(moveInfo: { Id: string, x: number, y: number }) {
        if(this._currentEditingBtAssetContent !== null) {
             let beModifiedNode = this._currentEditingBtAssetContent!.btNodes.find((n) => n.id === moveInfo.Id);
             if(beModifiedNode) {
                 beModifiedNode.position = { x: moveInfo.x, y: moveInfo.y };
             }
        }
    }


    public CreateNodeInEditingDocument(nodeType: BtNodeType, pos: EditorPosition) : void {
        if(this._currentEditingBtAssetContent) {
            let newNode : ILogicBtNode = {
                id: generateUniqueID(),
                type: nodeType,
                data: {
                },
                position: pos
            }
            this._currentEditingBtAssetContent!.btNodes.push(newNode);
            this._btEditorContentListener?.OnCreateNewNode([newNode]);
        }
    }

    public RemoveNodeInEditingDocument() {
    }

    public LinkNodeInEditingDocument(srcId: string, tarId: string) {
        let content = this._currentEditingBtAssetContent;
        if(content) {
            if(content.btNodes.some((n) => n.id === srcId) &&
                content.btNodes.some((n) => n.id === tarId)) {
                let newConnection: ILogicBtConnection = {
                    id: generateUniqueID(),
                    source: srcId,
                    target: tarId
                }
                content.btConnections.push(newConnection);
                this._btEditorContentListener?.OnNodeLinked([newConnection]);
            }
        }
    }

    public UnlinkInEditingDocument() {

    }

    public UpdateNodeDetailInEditingDocument(nodeId: string, nodeDetailContent: { [key: string] : any }) {
        if(this._currentEditingBtAssetContent !== null) {
            let goalNode = this._currentEditingBtAssetContent.btNodes.find(n => n.id === nodeId);
            if(goalNode) {
                let oldBttType = goalNode!.data.BttType;
                goalNode.data = {...goalNode.data, ...nodeDetailContent}
                if(goalNode.data.BttType !== oldBttType) {
                    this.FillDefaultNodeContentIfPossible(goalNode);
                }
            }
        }
    }

    private FillDefaultNodeContentIfPossible(node: ILogicBtNode) {
        if(node.data.BttType !== undefined) {
            let types = BehaviourTreeModel.Instance.GetBTTTypes();
            let currentType = types.find(
                (t) => t.BttType === node.data.BttType
            );

            Object.entries(currentType!.Content).map(([key, item]) => {
                if(node.data[key] === undefined) {
                    if(item.default) {
                        node.data[key] = item.default;
                    }
                }
            });
        }
    }


    private _nodeDetailFocusChangedListener: IInspectorFocusChangedListener | null = null;
    private _currentInspectorFocusId : string | null = null;
    public get CurrentInspectorFocusId () { return this._currentInspectorFocusId }

    public SetInspectNodeChangeListener(listener: IInspectorFocusChangedListener | null): void {
        this._nodeDetailFocusChangedListener = listener;
    }

    public InspectNodeDetail(nodeId: string | null): void {
        if( this._currentInspectorFocusId !== nodeId ) {
            this._currentInspectorFocusId = nodeId;
            this._nodeDetailFocusChangedListener?.OnInspectorFocusChanged(nodeId);
        }
    }


    //Query Behaviour Tree Task Types
    public GetBTTTypes() : { BttType: string, Content: object }[] {
        let BTTTypes = [
            {
                BttType : "BTT_None",
                Content: {}
            },
            {
                BttType : "BTT_Debug",
                Content: {
                    DebugLogLevel: { type: "Enum", default: "Log", OptionalItems: ["Log", "Warning", "Assert", "Error"] },
                    OutputContent: { type: "String", default: "" },

                    // CheckBox: { type: "Boolean", default: false },
                    //
                    // IntMember_Range: { type: "Int", default: 1, range: [1, 1000] },
                    // IntMember: { type: "Int", default: 1 },
                    // FloatMember_Range: { type: "Float", default: 1.0, range: [1.0, 1000.0] },
                    // FloatMember: { type: "Float", default: 1.0 },
                    // BBKeyMember: { type: "BBKey" },
                }
            },
            {
                BttType : "BTT_Wait",
                Content: {
                    WaitTime: { type: "Float", default: 5 },
                    IgnoreScale: { type: "Boolean", default: false }
                }
            },
        ]
        return BTTTypes;
    }

    public GetBTDTypes() : {}[] {
        return [{}]
    }

    public GetBTSTypes() : {}[] {
        return [{}]
    }
}
