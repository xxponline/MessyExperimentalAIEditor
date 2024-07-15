import {NetManager} from "../service/NetManager";
import {
    AckMessageCode,
    AckNetMessage,
    ListBtAssetsNtfMessage,
    NtfNetMessage,
    ReadBtAssetNtfMessage
} from "../service/NetMessage";
import {BtAssetDetail, BtAssetSummary, ILogicBtConnection, ILogicBtNode} from "./BehaviourTreeLogicDataStructure";
import {IAsyncResult} from "./MethodResult";


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

    public async RequestSaveBehaviourTree(assetPath: string, contentJson: any)
    {
        let opDetail = {
            assetPath : assetPath,
            btContent: contentJson
        }
        return NetManager.Instance.SendRequestMessage("/BehaviourTree/SaveBehaviourTree", opDetail );
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
    private _btDetailMap : Map<string, BtAssetDetail> = new Map();
    private _currentEditingBtAssetContent : BtAssetDetail | null = null;

    private OnNtfListBehaviourTrees(msg: NtfNetMessage)
    {
        let assetListMsg = msg as ListBtAssetsNtfMessage;
        // console.log("assetListMsg:");
        // console.log(assetListMsg);
        this._btAssetsList = assetListMsg.ntfOpContent;
        this._btAssetsListener?.OnBtAssetsListChanged();
    }

    private OnNtfReadBehaviourTrees(msg: NtfNetMessage)
    {
        let assetDetailMsg = msg as ReadBtAssetNtfMessage;
        // console.log("assetDetailMsg:");
        // console.log(assetDetailMsg);
        let assetPath = assetDetailMsg.ntfOpContent.assetPath;
        this._btDetailMap.set(assetPath, assetDetailMsg.ntfOpContent);
    }

    private _btAssetsListener: IBtAssetsChangeListener | null = null;
    public RegisterBtAssetsChangeListener(listener: IBtAssetsChangeListener) : void
    {
        this._btAssetsListener = listener;
    }
    public RemoveBtAssetsChangeListener() : void
    {
        this._btAssetsListener = null;
    }

    private _btAssetEditorListener: IBtEditorListener | null = null;
    public RegisterBtDocumentEditorListener(listener: IBtEditorListener) : void {
        this._btAssetEditorListener = listener;
    }
    public RemoveBtDocumentEditorListener(listener: IBtEditorListener) : void {
        this._btAssetEditorListener = null;
    }


    // Graphic Edit Implementation
    public async ChangeEditingBtAsset(path: string) {
        if(this._btDetailMap.has(path)) {
            this._currentEditingBtAssetContent = this._btDetailMap.get(path)!;
            let result = new Promise<IAsyncResult>((resolve) => {
                resolve({ success: true });
            })
            this._btAssetEditorListener?.OnCurrentEditingBtDocumentChanged();
            return result;
        }
        else {
            let netResult = await this.RequestReadBehaviourTree(path);
            if(netResult.ackCode === AckMessageCode.SUCCESS) {
                this._currentEditingBtAssetContent = this._btDetailMap.get(path)!;
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

    public GetEditingBtAssetContent() : [ Array<ILogicBtNode>, Array<ILogicBtConnection> ] {
        return [[], []]
    }


    public MoveNode() {

    }

    public CreateNode() {

    }

    public RemoveNode() {

    }

    public LinkNode() {

    }

    public RemoveConnection() {

    }
}
