import NetManager from "./NetManager";
import {ListBtAssetsNtfMessage, NtfNetMessage, ReadBtAssetNtfMessage} from "./NetMessage";
import {BtAssetDetail, BtAssetSummary} from "./BehaviourTreeModelDefine";

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

    public Init() : void
    {
        NetManager.Instance.RegisterNtfListener("/BehaviourTree/ListAllAssets",
            (ntfMsg)=> { this.OnNtfListBehaviourTrees(ntfMsg) });
        NetManager.Instance.RegisterNtfListener("/BehaviourTree/ReadBehaviourTree",
            (ntfMsg) => { this.OnNtfReadBehaviourTrees(ntfMsg) });
    }


    public async QueryAllBehaviourTrees()
    {
        return NetManager.Instance.SendRequestMessage("/BehaviourTree/ListAllAssets", {} );
    }

    public async SaveBehaviourTree(assetPath: string, contentJson: any)
    {
        let opDetail = {
            assetPath : assetPath,
            btContent: contentJson
        }
        return NetManager.Instance.SendRequestMessage("/BehaviourTree/SaveBehaviourTree", opDetail );
    }

    public async ReadBehaviourTree(assetPath: string)
    {
        let opDetail = {
            assetPath : assetPath
        }
        return NetManager.Instance.SendRequestMessage("/BehaviourTree/ReadBehaviourTree", opDetail );
    }

    private btSummaryList : Array<BtAssetSummary> = [];
    private btDetailMap : Map<string, BtAssetDetail> = new Map();



    private OnNtfListBehaviourTrees(msg: NtfNetMessage)
    {
        let assetListMsg = msg as ListBtAssetsNtfMessage;
        console.log("assetListMsg:");
        console.log(assetListMsg);
        this.btSummaryList = assetListMsg.ntfOpContent;

    }

    private OnNtfReadBehaviourTrees(msg: NtfNetMessage)
    {
        let assetDetailMsg = msg as ReadBtAssetNtfMessage;
        console.log("assetDetailMsg:");
        console.log(assetDetailMsg);
        this.btDetailMap.set(assetDetailMsg.ntfOpContent.assetPath, assetDetailMsg.ntfOpContent);
    }
}
