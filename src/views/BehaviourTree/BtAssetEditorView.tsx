import React, {type MouseEvent as ReactMouseEvent, useEffect} from "react";
import {
    Background,
    Controls,
    NodeChange,
    NodePositionChange,
    NodeRemoveChange,
    ReactFlow,
    useEdgesState,
    useNodesState
} from "reactflow";
import 'reactflow/dist/style.css';
import {BTRootNode, BTSelectorNode, BTSequenceNode, BTSimpleParallelNode, BTTaskNode} from "./BtAssetEditorNodeDisplay";
import {
    BtAssetEditorMenuView,
    EditorContextMenuEnum,
    IBtAssetEditorMenuHelper,
    MenuDirection
} from "./BtAssetEditorMenuView";
import {BtDisplayEdge, BtDisplayNode, BtDisplayNodeData, IAssetSummaryForTab} from "../../common/BtDisplayDS";
import {
    CreateBehaviourTreeNodeAPI,
    MoveBehaviourTreeNodeAPI,
    ReadAssetAPI,
    RemoveBehaviourTreeNodeAPI
} from "../../common/ServerAPI";
import {
    BehaviourTreeModifiedNodeDiffInfo,
    CreateBehaviourTreeNodeResponse,
    ReadBehaviourTreeAssetResponse
} from "../../common/ResponseDS";
import {IBtAssetDocument, ILogicBtNode} from "../../common/BtLogicDS";
import {BtNodeType} from "../../common/BtCommon";
import {EditorPosition} from "../../common/EditorCommon";
import {NodeSelectionChange} from "@reactflow/core/dist/esm/types/changes";
import {BtNodeInspectorView} from "./BtNodeInspectorView";
import {IBtNodeInspectorHelper} from "../../viewmodels/BehaviourTree/BtNodeInspectorViewModel";

const nodeTypes = {
    "bt_root" : BTRootNode,
    "bt_selector" : BTSelectorNode,
    "bt_sequence" : BTSequenceNode,
    "bt_simpleParallel" : BTSimpleParallelNode,
    "bt_task" : BTTaskNode
};


// export class BtAssetEditorView extends React.Component<IAssetSummaryForTab,
//     {
//         contextMenu: EditorContextMenuEnum,
//         menuDir: MenuDirection,
//         position: { x: number, y: number },
//         document: IBtAssetDocument | null,
//         currentDocVersion: string | null,
//         displayNodes: Array<BtDisplayNode>
//     }> implements IBtAssetEditorMenuHelper
// {
//     constructor(props: IAssetSummaryForTab) {
//         super(props);
//         this.state = {
//             contextMenu: EditorContextMenuEnum.None,
//             menuDir: MenuDirection.RightDown,
//             position: { x: 0, y: 0 },
//             currentDocVersion: null,
//             document: null,
//             displayNodes: []
//         };
//     }

    // componentDidMount() {
    //     this.ReadBehaviourTreeDocument();
    // }
    //
    // ReadBehaviourTreeDocument() {
    //     fetch(ReadAssetAPI, {
    //         method: 'POST',
    //         body: JSON.stringify({ assetId: this.props.assetId })
    //     }).then(
    //         res => res.json()
    //     ).then(
    //         (jData: ReadBehaviourTreeAssetResponse) => {
    //             let doc: IBtAssetDocument = JSON.parse(jData.assetDocument.assetContent);
    //             this.setState({ document: doc, currentDocVersion: jData.assetDocument.assetVersion, displayNodes: this.TransformNodeFromLogicToDisplay(doc.Nodes) });
    //         }
    //     ).catch(
    //
    //     ).finally(
    //
    //     )
    // }
    //
    // //Display Info Transform
    // private TransformNodeFromLogicToDisplay(nodes: Array<ILogicBtNode> | undefined) : Array<BtDisplayNode> {
    //     if(nodes) {
    //         let displayNodes = nodes.map(node => {
    //             let displayNode: BtDisplayNode = {
    //                 id: node.id,
    //                 position: node.position,
    //                 type: node.type,
    //                 selected: false,
    //                 data: {
    //                     taskType: node.data ? node.data.BttTask : "",
    //                     order: node.order,
    //                     descriptors: [],
    //                     services: []
    //                 }
    //             }
    //             return displayNode;
    //         });
    //         return displayNodes;
    //     }
    //     else {
    //         return []
    //     }
    // }
    //
    // //Menu Method Implementation
    // CreateNode(type: BtNodeType, pos: EditorPosition): void {
    //     fetch(CreateBehaviourTreeNodeAPI, {
    //         method: 'POST',
    //         body: JSON.stringify(
    //             {
    //                 assetId: this.props.assetId,
    //                 prevVersion: this.state.currentDocVersion,
    //                 position: pos,
    //                 nodeType: type
    //             }
    //         )
    //     }).then(
    //     ).then(
    //     )
    // }
    //
    // RemoveNodes(Ids: string[]): void {
    //     fetch(RemoveBehaviourTreeNodeAPI,{
    //         method: 'POST',
    //         body: JSON.stringify(
    //             {
    //                 assetId: this.props.assetId,
    //                 prevVersion: this.state.currentDocVersion,
    //                 nodeIds: Ids
    //             }
    //         )
    //     }).then(
    //
    //     )
    // }
    //
    //
    // // Show ContextMenu
    // private elementRef: React.RefObject<HTMLDivElement> = React.createRef();
    //
    // OnNodeContextMenu(e: React.MouseEvent<Element, MouseEvent>) {
    //     e.preventDefault();
    //     let viewRectangle = this.elementRef.current!.getBoundingClientRect();
    //     this.setState({contextMenu: EditorContextMenuEnum.Node, position: { x: e.clientX - viewRectangle.x, y: e.clientY - viewRectangle.y }});
    // }
    //
    // OnPaneContextMenu(e: React.MouseEvent<Element, MouseEvent>) {
    //     e.preventDefault();
    //     let viewRectangle = this.elementRef.current!.getBoundingClientRect();
    //     this.setState({contextMenu: EditorContextMenuEnum.Pane, position: { x: e.clientX - viewRectangle.x, y: e.clientY - viewRectangle.y }});
    // }
    //
    // OnEdgeContextMenu(e: React.MouseEvent<Element, MouseEvent>) {
    //     e.preventDefault();
    //     let viewRectangle = this.elementRef.current!.getBoundingClientRect();
    //     this.setState({contextMenu: EditorContextMenuEnum.Edge, position: { x: e.clientX - viewRectangle.x, y: e.clientY - viewRectangle.y }});
    // }
    //
    // OnCancelContextMenu(e: React.MouseEvent<Element, MouseEvent>) {
    //     this.setState({contextMenu: EditorContextMenuEnum.None});
    // }
    //
    // OnNodesChange(changes: NodeChange[]) {
    //     let selectChangeItems: NodeSelectionChange[] = [];
    //     let positionChangeItems: NodePositionChange[] = [];
    //     let removeChangeItems: NodeRemoveChange[] = [];
    //
    //     for (let changeItem of changes) {
    //         switch (changeItem.type) {
    //             case "select": {
    //                 selectChangeItems.push(changeItem);
    //             }
    //                 break;
    //             case "position": {
    //                 positionChangeItems.push(changeItem);
    //             }
    //                 break;
    //             case "dimensions":
    //                 //there nothing to do when get dimensions NodeChange event
    //                 break;
    //             case "remove":
    //                 removeChangeItems.push(changeItem);
    //                 break;
    //             default:
    //                 console.error(changeItem);
    //                 //BehaviourTreeModel.Instance
    //                 break;
    //         }
    //     }


        ////
        // this.setState(prevState => ({
        //         displayNodes: prevState.displayNodes.map((displayNode) => {
        //             let chItem = selectChangeItems.find(ch => ch.id === displayNode.id );
        //             if(chItem) {
        //                 displayNode.selected = chItem.selected;
        //             }
        //             return displayNode
        //         })
        // }));

        // let hasSelecting = false;
        // for (let changeItem of selectChangeItems) {
        //     hasSelecting = true;
        //     for (let node of this.state.displayNodes) {
        //         if (changeItem.id === node.id) {
        //             node.selected = changeItem.selected;
        //         }
        //     }
        // }
    // }

    // render() {
    //
    //     return(
    //         <div style={{display: "flex", flexDirection: "row", alignItems: "center", height:"100%" }}>
    //             <div style={{ width: "85%", height: "100%" }} >
    //                 <ReactFlow
    //                     ref={this.elementRef}
    //                     nodes={this.state.displayNodes}
    //                     edges={[]}
    //                     onNodesChange={(changes) => { this.OnNodesChange(changes)}}
    //                     onEdgesChange={() => {}}
    //                     onNodeContextMenu={ (e) => {this.OnNodeContextMenu(e)} }
    //                     onPaneContextMenu={ (e) => {this.OnPaneContextMenu(e)} }
    //                     onEdgeContextMenu={ (e) => {this.OnEdgeContextMenu(e)} }
    //                     onNodeClick={(e) => {this.OnCancelContextMenu(e)}}
    //                     onEdgeClick={(e) => {this.OnCancelContextMenu(e)}}
    //                     onClick={(e) => {this.OnCancelContextMenu(e)}}
    //
    //                     onConnect={() => {}}
    //
    //                     selectionOnDrag={true}
    //                     panOnDrag={true}
    //
    //                     nodeTypes={nodeTypes}
    //                 >
    //                     <Controls/>
    //                     {/*<MiniMap/>*/}
    //                     <Background gap={12} size={1}/>
    //                     <BtAssetEditorMenuView contextMenu={this.state.contextMenu}
    //                                            dirMenu={this.state.menuDir} position={this.state.position}
    //                                            editorHelper={this}
    //                     />
    //                 </ReactFlow>
    //             </div>
    //             <div style={{ width: "15%", height: "100%" }}>
    //                 11111
    //             </div>
    //         </div>
    //
    //
    //     )
    // }
// }


export function NewBtEditorView(props: IAssetSummaryForTab) {
    const elementRef: React.RefObject<HTMLDivElement> = React.createRef();
    const [displayNodes, setDisplayNodes, onNodesChange] = useNodesState<BtDisplayNodeData>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<BtDisplayEdge>([]);
    const [assetVersion, SetAssetVersion] = React.useState<string>("");
    const [contextMenuType, setContextMenuType] = React.useState<EditorContextMenuEnum>(EditorContextMenuEnum.None);
    const [menuDir, setMenuDir] = React.useState<MenuDirection>(MenuDirection.RightDown);
    const [menuPosition, setMenuPosition] = React.useState<{x: number, y:number}>( { x: 0, y: 0 } );

    const transformLogicNodesArrayToDisplay = (nodes: Array<ILogicBtNode> | undefined) : Array<BtDisplayNode> => {
        if(nodes) {
            let displayNodes = nodes.map(transformNodeFromLogicToDisplay);
            return displayNodes;
        }
        else {
            return []
        }
    }

    const transformNodeFromLogicToDisplay = (logicNode: ILogicBtNode) : BtDisplayNode => {
        let displayNode: BtDisplayNode = {
            id: logicNode.id,
            position: logicNode.position,
            type: logicNode.type,
            selected: false,
            data: {
                taskType: logicNode.data ? logicNode.data.BttTask : "",
                order: logicNode.order,
                descriptors: [],
                services: []
            }
        }
        return displayNode;
    }

    const passModifiedNodeInfos = (prevDisplayNodes: Array<BtDisplayNode>, modifiedDiffInfos: Array<BehaviourTreeModifiedNodeDiffInfo>) : Array<BtDisplayNode> => {
        //pass remove or update
        let result: Array<BtDisplayNode> = [];
        for(let item of prevDisplayNodes) {
            let modifiedInfoItem = modifiedDiffInfos.find(m => m.preModifiedNode?.id === item.id);
            if(modifiedInfoItem) {
                if(modifiedInfoItem.postModifiedNode) {
                    // Update
                    result.push(transformNodeFromLogicToDisplay(modifiedInfoItem.postModifiedNode))
                }
                else {
                    // Remove, do nothing
                }
            }
            else {
                result.push(item);
            }
        }
        //add new
        let additionalNodes = modifiedDiffInfos.filter(m => !m.preModifiedNode)
            .map(m => m.postModifiedNode!)
        if(additionalNodes.length > 0) {
            result.push(...transformLogicNodesArrayToDisplay(additionalNodes))
        }

        return result
    }

    useEffect(() => {
        fetch(ReadAssetAPI, {
            method: 'POST',
            body: JSON.stringify({ assetId: props.assetId })
        }).then(
            res => res.json()
        ).then(
            (jData: ReadBehaviourTreeAssetResponse) => {
                let doc: IBtAssetDocument = JSON.parse(jData.assetDocument.assetContent);
                setDisplayNodes(transformLogicNodesArrayToDisplay(doc.Nodes));
                SetAssetVersion(jData.assetDocument.assetVersion);
            }
        ).catch(

        ).finally(

        )
    },[])

    //Inspector Helper

    const inspectorHelper: IBtNodeInspectorHelper = {
        UpdateBttType: (currentTypeName: string): void => {

        },
        UpdateSettings: (settingItermKey: string, settingValue: any): void => {

        }
    }

    //End Inspector Helper

    //Menu Helper
    const RequestCreateBehaviourTreeNode = (nType: BtNodeType, position: { x: number, y: number }) => {
        fetch(CreateBehaviourTreeNodeAPI, {
            method: 'POST',
            body: JSON.stringify(
                {
                    assetId: props.assetId,
                    currentVersion: assetVersion,
                    position: position,
                    nodeType: nType
                }
            )
        }).then(
            res => res.json()
        ).then(
            (res: CreateBehaviourTreeNodeResponse) => {
                if(res.errCode === 0) {
                    setDisplayNodes((prevState) => passModifiedNodeInfos(prevState, res.modificationInfo.diffNodesInfos))
                    SetAssetVersion(res.modificationInfo.newVersion);
                }
            }
        )
    }

    const RequestRemoveSelectedBehaviourTreeNodes = () => {
        let selectedNodeIds = displayNodes.filter(m => m.selected).map(m => m.id);
        if(selectedNodeIds.length > 0) {
            fetch(RemoveBehaviourTreeNodeAPI, {
                method: 'POST',
                body: JSON.stringify(
                    {
                        assetId: props.assetId,
                        currentVersion: assetVersion,
                        nodeIds: selectedNodeIds,
                    }
                )
            }).then(
                res => res.json()
            ).then(
                (res: CreateBehaviourTreeNodeResponse) => {
                    if(res.errCode === 0) {
                        setDisplayNodes((prevState) => passModifiedNodeInfos(prevState, res.modificationInfo.diffNodesInfos))
                        SetAssetVersion(res.modificationInfo.newVersion);
                    }
                }
            )
        }
    }

    const menuHelper: IBtAssetEditorMenuHelper = {
        CreateNode: RequestCreateBehaviourTreeNode,
        RemoveNodes: RequestRemoveSelectedBehaviourTreeNodes,
    }

    //End Menu Helper

    //Node Change Methods

    const OnCustomNodesChange = (changes: NodeChange[]) => {
        changes = changes.filter(m => m.type !== 'remove'); //filter remove todo we can consider integrate our remove logic here?

        {
            //pass node movement
            let movementChanges = changes.filter(m => m.type === 'position')
                .map(m => m as NodePositionChange)
                .filter(m => !m.dragging);
            if(movementChanges.length > 0) {
                let movedNodes =  displayNodes.filter(m => movementChanges.map(m => m.id).includes(m.id))
                RequestMoveBehaviourTreeNodes(movedNodes.map( m=> { return {
                    nodeId: m.id,
                    toPosition: m.position
                }}))
            }

        }

        onNodesChange(changes)
    }

    const RequestMoveBehaviourTreeNodes = (movementInfos: Array<{ nodeId: string, toPosition: { x: number, y: number } }>) => {
        if(movementInfos.length > 0){
            fetch(MoveBehaviourTreeNodeAPI, {
                method: 'POST',
                body: JSON.stringify(
                    {
                        assetId: props.assetId,
                        currentVersion: assetVersion,
                        movements: movementInfos,
                    }
                )
            }).then(
                res => res.json()
            ).then(
                (res: CreateBehaviourTreeNodeResponse) => {
                    if(res.errCode === 0) {
                        //The display refreshing is not necessary in movement response
                        SetAssetVersion(res.modificationInfo.newVersion);
                    }
                }
            )
        }
    }

    //End Node Change Methods

    const GetSelectedNodeInfo = (): [string, string] => {
        let selectedDisplayNodes = displayNodes.filter(m => m.selected);
        if(selectedDisplayNodes.length === 0) {
            return ["Empty Selected", "Empty Selected"]
        }
        else if(selectedDisplayNodes.length === 1) {
            return [selectedDisplayNodes[0].type!, selectedDisplayNodes[0].id];
        }
        else {
            return ["Multiple Selected","Multiple Selected"]
        }
    }
    let [selectedType, selectedId] = GetSelectedNodeInfo();


    const OnInvokeContextMenu = (event: ReactMouseEvent, menuType: EditorContextMenuEnum) => {
        event.preventDefault();
        if(menuType !== contextMenuType)
        {
            let viewRectangle = elementRef.current!.getBoundingClientRect();
            setContextMenuType(menuType);
            if(menuType !== EditorContextMenuEnum.None) {
                setMenuDir(MenuDirection.RightDown);
                setMenuPosition({ x: event.clientX - viewRectangle.x, y: event.clientY - viewRectangle.y })
            }
        }
    }

    return (
        <div style={{display: "flex", flexDirection: "row", alignItems: "center", height: "100%"}}>
            <div style={{width: "85%", height: "100%"}}>
                <ReactFlow
                    ref={elementRef}
                    nodes={displayNodes}
                    edges={edges}
                    onNodesChange={OnCustomNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeContextMenu={(e) => OnInvokeContextMenu(e, EditorContextMenuEnum.Node)}
                    onPaneContextMenu={(e) => OnInvokeContextMenu(e, EditorContextMenuEnum.Pane)}
                    onEdgeContextMenu={(e) => OnInvokeContextMenu(e, EditorContextMenuEnum.Edge)}
                    onNodeClick={(e) => OnInvokeContextMenu(e, EditorContextMenuEnum.None)}
                    onEdgeClick={(e) => OnInvokeContextMenu(e, EditorContextMenuEnum.None)}
                    onClick={(e) => OnInvokeContextMenu(e, EditorContextMenuEnum.None)}

                    onConnect={() => {}}

                    selectionOnDrag={true}
                    panOnDrag={false}

                    nodeTypes={nodeTypes}
                >
                    <Controls/>
                    {/*<MiniMap/>*/}
                    <Background gap={12} size={1}/>
                    <BtAssetEditorMenuView contextMenu={contextMenuType}
                                           dirMenu={menuDir} position={menuPosition}
                                           editorHelper={menuHelper}
                    />
                </ReactFlow>
            </div>
            <div style={{width: "15%", height: "100%"}}>
                <BtNodeInspectorView DocVersion={assetVersion} BttViewInfo={null} NodeType={selectedType} InspectNodeId={selectedId} Helper={inspectorHelper} />
            </div>
        </div>
    );
}


