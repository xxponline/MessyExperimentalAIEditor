import React from "react";
import {BehaviourTreeModel, IBtAssetsChangeListener} from "../../models/BehaviourTreeModel";
import {NetManager, NetStateEnum} from "../../service/NetManager";
import {BtAssetExplorerView} from "../../views/BehaviourTree/BtAssetExplorerView";

export class PathNode {
    type!: 'd' | 'f';
    name!: string;
    children!: PathNode[];
    guid!: string;
}

export interface IBtAssetExplorerRenderParameters {
    root: PathNode;
    OpenBtAsset: (guid: string) => void;
}


export class BtAssetExplorerViewModel extends React.Component<
    {},
    { root : PathNode }>
    implements IBtAssetsChangeListener
{
    constructor(props: any) {
        super(props);
        this.state = { root: { type: "d", name: "root", children: [], guid: "root_guid"} }
    }

    public RefreshBtAssetsList(): void
    {
        if(NetManager.Instance.NetState === NetStateEnum.StateConnected) {
            BehaviourTreeModel.Instance.RequestBehaviourTreesAssetsList().then(
                (e)=> {
                    //result process
                }
            );
        }
    }

    public EditBtAsset(guid: string): void {
        let goalSummary = BehaviourTreeModel.Instance.BtAssetsList.find(m => m.assetGuid === guid);
        if(goalSummary) {
            BehaviourTreeModel.Instance.ChangeEditingBtAsset(goalSummary.assetPath).then((result) => {
            })
        }
    }

    componentDidMount() {
        BehaviourTreeModel.Instance.Init();
        BehaviourTreeModel.Instance.RegisterBtAssetsChangeListener(this);
        this.RefreshBtAssetsList();
    }

    componentWillUnmount() {
        BehaviourTreeModel.Instance.RemoveBtAssetsChangeListener(this);
    }


    render() {
        return (
            <BtAssetExplorerView {...this.state} OpenBtAsset={(guid) => this.EditBtAsset(guid)} />
        );
    }


    OnBtAssetsListChanged(): void {

        let routerRoot : PathNode = { type: 'd', name: 'Root', children: [], guid: "root"};
        let routerVisitor : PathNode = routerRoot;
        for(let item of BehaviourTreeModel.Instance.BtAssetsList)
        {
            let subPaths = item.assetPath.split("/");
            routerVisitor = routerRoot;
            let pathStr: Array<string> = [];
            for(let i = 0; i < subPaths.length; ++i)
            {
                let subPath = subPaths[i];
                pathStr.push(subPath);
                let routeNode = routerVisitor.children!.find((node) => node.name === subPath)
                if(routeNode === undefined) {
                    if(i === subPaths.length - 1) {
                        //file
                        let node: PathNode = { type: 'f', name: subPath, children:[], guid: item.assetGuid };
                        routerVisitor.children!.push(node);
                        routerVisitor = node;
                    }
                    else{
                        //dic
                        let node: PathNode = { type: 'd', name: subPath, children:[], guid: `d:${pathStr.join()}` };
                        routerVisitor.children!.push(node);
                        routerVisitor = node;
                    }
                }
                else {
                    if(routeNode.type === 'f'){
                        console.error(`${routeNode.name} is a expected file node`);
                    }
                    routerVisitor = routeNode!;
                }
            }
        }

        this.setState({ root : routerRoot })
    }
}
