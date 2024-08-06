import {NetManager} from "../service/NetManager";
import {
    AckMessageCode, BttNodeMetaNtfMessage, ListBtAssetsNtfMessage,
    NtfNetMessage,
    ReadBtAssetNtfMessage
} from "../service/NetMessage";
import {BtAssetDetail, BtAssetSummary, IBttNodeData, ILogicBtConnection, ILogicBtNode} from "./BtLogicDataStructure";
import {IAsyncResult} from "./MethodResult";
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";
import {BtNodeType, BttNodeMeta} from "../common/BtCommon";
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
            NetManager.Instance.RegisterNtfListener("/BehaviourTree/GetBttNodeMetas",
                (ntfMsg) => {
                    this.OnNtfBttNodeMetas(ntfMsg)
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
                data: null
            });
        }

        this._currentEditingBtAssetContent.btNodes.forEach((n) => {
            if(n.type == "bt_task") {
                if( n.data!.BttType === undefined){
                    n.data!.BttType = "BTT_None";
                    n.data!.Order = 0;
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

    private GetParentNodeFromEditingBtAssetContent(node: ILogicBtNode) : ILogicBtNode | null {
        if(node.type === "bt_root") {
            return null;
        }

        if(this._currentEditingBtAssetContent) {
            let connectionFromParent= this._currentEditingBtAssetContent
                .btConnections.find(c => c.target === node.id);
            if(connectionFromParent) {
                let result = this._currentEditingBtAssetContent.btNodes
                    .find(n => n.id == connectionFromParent!.source);
                if(result !== undefined) {
                    return result;
                }
            }
        }
        return null;
    }

    private GetChildrenNodeFromEditingBtAssetContent(node: ILogicBtNode) : ILogicBtNode[] {

        if(this._currentEditingBtAssetContent) {
            let connectionsFromParent = this._currentEditingBtAssetContent.btConnections
                        .filter(c => c.source === node!.id);
            let connectionIds = connectionsFromParent.map(c => c.target);
            return this._currentEditingBtAssetContent.btNodes
                        .filter(n => connectionIds.includes(n.id));
        }
        return []
    }


    public MoveNode(moveInfo: { Id: string, x: number, y: number }) {
        if(this._currentEditingBtAssetContent !== null) {
             let beModifiedNode = this._currentEditingBtAssetContent!.btNodes.find((n) => n.id === moveInfo.Id);
             if(beModifiedNode) {
                 beModifiedNode.position = { x: moveInfo.x, y: moveInfo.y };

                 //Resort the order of node and some node witch have the same parent;
                 let parentNode = this.GetParentNodeFromEditingBtAssetContent(beModifiedNode);
                 if(parentNode) {
                     let waitForResortNodes = this.GetChildrenNodeFromEditingBtAssetContent(parentNode);
                     waitForResortNodes.sort((a,b) => a.position.x - b.position.x);
                     for(let i = 0; i < waitForResortNodes.length; i++) {
                         waitForResortNodes[i].data!.Order = i;
                     }
                 }
             }
        }
    }


    public CreateNodeInEditingDocument(nodeType: BtNodeType, pos: EditorPosition) : void {
        if(this._currentEditingBtAssetContent) {
            let newNode : ILogicBtNode = {
                id: generateUniqueID(),
                type: nodeType,
                data: null,
                position: pos
            }
            switch (newNode.type) {
                case "bt_task":
                    newNode.data = {
                        BttType: "BTT_None",
                        Order: 0
                    }
                    break;
                case "bt_root":
                case "bt_simpleParallel":
                case "bt_sequence":
                case "bt_selector":
                    newNode.data = {
                        Order: 0
                    }
                    break;
                default:
                    break;
            }
            this._currentEditingBtAssetContent!.btNodes.push(newNode);
            this._btEditorContentListener?.OnCreateNewNode([newNode]);
        }
    }

    public RemoveNodeInEditingDocument(nodeIds: Array<string>) {
        if(this._currentEditingBtAssetContent) {
            this._currentEditingBtAssetContent.btNodes = this._currentEditingBtAssetContent.btNodes
                .filter((n) => !nodeIds.includes(n.id));

            let waitForRemoveConnectionIds : Array<string> = this._currentEditingBtAssetContent.btConnections
                .filter((c) => nodeIds.includes(c.source) || nodeIds.includes(c.target)).map(c => c.id);
            console.log(waitForRemoveConnectionIds);

            this._currentEditingBtAssetContent.btConnections = this._currentEditingBtAssetContent.btConnections
                .filter((c) => !waitForRemoveConnectionIds.includes(c.id));

            this._btEditorContentListener?.OnRemoveElement(nodeIds, waitForRemoveConnectionIds);
        }
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
                switch (goalNode.type) {
                    case "bt_task":
                        let oldBttType = goalNode.data!.BttType;
                        goalNode.data = {...(goalNode.data as IBttNodeData), ...nodeDetailContent}
                        if(goalNode.data.BttType !== oldBttType) {
                            this.FillDefaultNodeContentIfPossible(goalNode);
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    private FillDefaultNodeContentIfPossible(node: ILogicBtNode) {
        if(node.type === "bt_task") {
            if(node.data!.BttType === undefined) {
                node.data!.BttType = "BTT_None";
            }
            let types = BehaviourTreeModel.Instance.GetBTTTypes();
            let currentType = types.find(
                (t) => t.BttType === node.data!.BttType
            );

            Object.entries(currentType!.Content).map(([key, item]) => {
                if(node.data![key] === undefined) {
                    if(item.default) {
                        node.data![key] = item.default;
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

    //Btt Node Meta
    public async RequestBehaviourTreesBttNodeMetas()
    {
        return NetManager.Instance.SendRequestMessage("/BehaviourTree/GetBttNodeMetas", {} );
    }

    private OnNtfBttNodeMetas(msg: NtfNetMessage) : void {
        this._bttNodeMeta = (msg as BttNodeMetaNtfMessage).ntfOpContent;
        console.log(this._bttNodeMeta);
    }

    private _bttNodeMeta : BttNodeMeta[] = [];
    public GetBTTTypes() : BttNodeMeta[] {
        return this._bttNodeMeta;
        // let BTTTypes = [
        //     {
        //         BttType : "BTT_None",
        //         Content: {}
        //     },
        //     {
        //         BttType : "BTT_Debug",
        //         Content: {
        //             DebugLogLevel: { type: "Enum", default: "Log", OptionalItems: ["Log", "Warning", "Assert", "Error"] },
        //             OutputContent: { type: "String", default: "" },
        //
        //             // CheckBox: { type: "Boolean", default: false },
        //             //
        //             // IntMember_Range: { type: "Int", default: 1, range: [1, 1000] },
        //             // IntMember: { type: "Int", default: 1 },
        //             // FloatMember_Range: { type: "Float", default: 1.0, range: [1.0, 1000.0] },
        //             // FloatMember: { type: "Float", default: 1.0 },
        //             // BBKeyMember: { type: "BBKey" },
        //         }
        //     },
        //     {
        //         BttType : "BTT_Wait",
        //         Content: {
        //             WaitTime: { type: "Float", default: 5 },
        //             IgnoreScale: { type: "Boolean", default: false }
        //         }
        //     },
        // ]
        // return BTTTypes;
    }

    public GetBTDTypes() : {}[] {
        return [{}]
    }

    public GetBTSTypes() : {}[] {
        return [{}]
    }
}
