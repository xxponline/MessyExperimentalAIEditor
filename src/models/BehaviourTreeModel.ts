import {NetManager} from "../service/NetManager";
import {
    AckMessageCode, ListBtAssetsNtfMessage,
    NtfNetMessage,
    ReadBtAssetNtfMessage
} from "../service/NetMessage";
import {BtAssetDetail, BtAssetSummary, ILogicBtConnection, ILogicBtNode} from "./BtLogicDataStructure";
import {IAsyncResult} from "./MethodResult";
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";

export type BtNodeType = ("bt_selector" | "bt_sequence" | "bt_simpleParallel" | "bt_task");


export interface IBtAssetsChangeListener {
    OnBtAssetsListChanged(): void
}

export interface IBtEditorListener {
    OnCurrentEditingBtDocumentChanged(): void
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
        // console.log("assetListMsg:");
        // console.log(assetListMsg);
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
    private _btAssetEditorListener: IBtEditorListener | null = null;
    public RegisterBtDocumentEditorListener(listener: IBtEditorListener) : void {
        this._btAssetEditorListener = listener;
    }
    public RemoveBtDocumentEditorListener(listener: IBtEditorListener) : void {
        this._btAssetEditorListener = null;
    }

    private _btAssetsContentMap : Map<string, BtAssetDetail> = new Map();
    private _currentEditingBtAssetContent : BtAssetDetail | null = null;
    private _currentEditingBtAssetPath: string | null = null;

    private OnNtfReadBehaviourTrees(msg: NtfNetMessage)
    {
        let assetDetailMsg = msg as ReadBtAssetNtfMessage;
        // console.log("assetDetailMsg:");
        // console.log(assetDetailMsg);
        let assetPath = assetDetailMsg.ntfOpContent.assetPath;
        this._btAssetsContentMap.set(assetPath, assetDetailMsg.ntfOpContent);
    }


    public async ChangeEditingBtAsset(path: string) {
        if(this._btAssetsContentMap.has(path)) {
            this.ChangeEditingBtAssetInner(path);
            let result = new Promise<IAsyncResult>((resolve) => {
                resolve({ success: true });
            })
            this._btAssetEditorListener?.OnCurrentEditingBtDocumentChanged();
            return result;
        }
        else {
            let netResult = await this.RequestReadBehaviourTree(path);
            if(netResult.ackCode === AckMessageCode.SUCCESS) {
                this.ChangeEditingBtAssetInner(path);
                let result = new Promise<IAsyncResult>((resolve) => {
                    resolve({ success: true });
                })
                this._btAssetEditorListener?.OnCurrentEditingBtDocumentChanged();
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
        if(this._currentEditingBtAssetPath == path) {
            return false;
        }
        this._currentEditingBtAssetPath = path;
        this._currentEditingBtAssetContent = this._btAssetsContentMap.get(path)!
        if(this._currentEditingBtAssetContent.btNodes === null) {
            this._currentEditingBtAssetContent.btNodes = [];
            if(this._currentEditingBtAssetContent.btNodes.every((n) => n.type !== 'bt_root')) {
                this._currentEditingBtAssetContent.btNodes = this._currentEditingBtAssetContent.btNodes.concat({
                    id: generateUniqueID(),
                    type: "bt_root",
                    position: { x : 100, y: 100 },
                    data: {}
                });
            }
        }
        if(this._currentEditingBtAssetContent.btConnections === null) {
            this._currentEditingBtAssetContent.btConnections = [];
        }
        return true;
    }

    public GetEditingBtAssetContent() : [ Array<ILogicBtNode>, Array<ILogicBtConnection> ] {
        return [this._currentEditingBtAssetContent!.btNodes, this._currentEditingBtAssetContent!.btConnections];
    }


    public MoveNode(moveInfo: { Id: string, x: number, y: number }) {
        if(this._currentEditingBtAssetContent !== null) {
             let beModifiedNode = this._currentEditingBtAssetContent!.btNodes.find((n) => n.id == moveInfo.Id);
             if(beModifiedNode) {
                 beModifiedNode.position = { x: moveInfo.x, y: moveInfo.y };
             }
        }
    }


    public CreateNode(nodeType: BtNodeType, pos: { x: number; y: number }) : void {
        if(this._currentEditingBtAssetContent) {
            let newNode : ILogicBtNode = {
                id: generateUniqueID(),
                type: nodeType,
                data: {
                },
                position: pos
            }
            this._currentEditingBtAssetContent!.btNodes.push(newNode);
        }
    }

    public RemoveNode() {
    }

    public LinkNode(srcId: string, tarId: string) {

    }

    public RemoveConnection() {

    }
}
