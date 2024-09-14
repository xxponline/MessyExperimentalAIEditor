import React, {type MouseEvent as ReactMouseEvent, useEffect} from "react";
import {
    Background,
    Controls, EdgeChange,
    NodeChange,
    NodePositionChange,
    ReactFlow,
    useEdgesState,
    useNodesState
} from "reactflow";
import 'reactflow/dist/style.css';
import {BTRootNode, BTSelectorNode, BTSequenceNode, BTTaskNode} from "./BtAssetEditorNodeDisplay";
import {
    BtAssetEditorMenuView,
    EditorContextMenuEnum,
    IBtAssetEditorMenuHelper,
    MenuDirection
} from "./BtAssetEditorMenuView";
import {BtDisplayEdge, BtDisplayNode, BtDisplayNodeData, IAssetSummaryForTab} from "../../common/BtDisplayDS";
import {
    ConnectBehaviourTreeNodeAPI,
    CreateBehaviourTreeNodeAPI, DisconnectBehaviourTreeNodeAPI,
    MoveBehaviourTreeNodeAPI,
    ReadAssetAPI,
    RemoveBehaviourTreeNodeAPI
} from "../../common/ServerAPI";
import {
    BehaviourTreeModifiedNodeDiffInfo, ConnectBehaviourTreeNodeResponse,
    CreateBehaviourTreeNodeResponse,
    ReadBehaviourTreeAssetResponse, RemoveBehaviourTreeNodeResponse, SolutionDetailItem
} from "../../common/ResponseDS";
import {IBtAssetDocument, IBtSettings, ILogicBtNode} from "../../common/BtLogicDS";
import {BtNodeType} from "../../common/BtCommon";
import {BtNodeInspectorView, IBtNodeConfigurableData, IBtNodeInspectorHelper} from "./BtNodeInspectorView";
import {Connection} from "@reactflow/core/dist/esm/types/general";
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";


const nodeTypes = {
    "bt_root" : BTRootNode,
    "bt_selector" : BTSelectorNode,
    "bt_sequence" : BTSequenceNode,
    // "bt_simpleParallel" : BTSimpleParallelNode,
    "bt_task" : BTTaskNode
};

export function BehaviourTreeGraphEditorView(props: IAssetSummaryForTab & { solutionInfo: SolutionDetailItem }) {
    const elementRef: React.RefObject<HTMLDivElement> = React.createRef();
    const [displayNodes, setDisplayNodes, onNodesChange] = useNodesState<BtDisplayNodeData>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<BtDisplayEdge>([]);
    const [assetVersion, SetAssetVersion] = React.useState<string>("");
    const [contextMenuType, setContextMenuType] = React.useState<EditorContextMenuEnum>(EditorContextMenuEnum.None);
    const [menuDir, setMenuDir] = React.useState<MenuDirection>(MenuDirection.RightDown);
    const [menuPosition, setMenuPosition] = React.useState<{x: number, y:number}>( { x: 0, y: 0 } );

    // Display Node And Edge Methods
    const transformLogicNodesArrayToDisplay = (nodes: Array<ILogicBtNode> | undefined) : Array<BtDisplayNode> => {
        if(nodes) {
            let displayNodes = nodes.map(transformNodeFromLogicToDisplay);
            return displayNodes;
        }
        else {
            return [];
        }
    }

    const transformNodeFromLogicToDisplay = (logicNode: ILogicBtNode) : BtDisplayNode => {
        let displayNode: BtDisplayNode = {
            id: logicNode.id,
            position: logicNode.position,
            type: logicNode.type,
            selected: false,
            data: {
                behaviourTreeParentId: logicNode.parentId,
                order: logicNode.order,
                descriptors: [],
                services: [],
                settings: logicNode.settings
            }
        }
        return displayNode;
    }

    const passModifiedNodeInfos = (prevDisplayNodes: Array<BtDisplayNode>, modifiedDiffInfos: Array<BehaviourTreeModifiedNodeDiffInfo>) : Array<BtDisplayNode> => {
        console.log(modifiedDiffInfos)
        //pass remove or update
        let result: Array<BtDisplayNode> = [];
        for(let item of prevDisplayNodes) {
            let modifiedInfoItem = modifiedDiffInfos.find(m => m.modifiedNodeId === item.id);
            if(modifiedInfoItem) {
                if(modifiedInfoItem.postModifiedNode) {
                    // Update
                    let newDisplayNode = transformNodeFromLogicToDisplay(modifiedInfoItem.postModifiedNode);
                    newDisplayNode.selected = item.selected;
                    result.push(newDisplayNode)
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

    const buildEdgeByDisplayNodes = (displayNodes: Array<BtDisplayNode>): Array<BtDisplayEdge> => {
        return displayNodes.filter(m => m.data.behaviourTreeParentId.length > 0).map(m => {
            return {
                id: generateUniqueID(),
                source: m.data.behaviourTreeParentId,
                target: m.id
            }
        })
    }

    //End Display Node And Edge Methods

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

    useEffect(() => {
        setEdges(buildEdgeByDisplayNodes(displayNodes));
    }, [displayNodes])


    //Inspector Helper

    const inspectorHelper: IBtNodeInspectorHelper = {
        UpdateBttType: (currentTypeName: string): void => {

        },
        UpdateSettings: (settingItermKey: string, settingValue: any): void => {

        }
    }

    //End Inspector Helper

    //Menu Helper
    const RequestCreateBehaviourTreeNode = (nType: BtNodeType, position: { x: number, y: number }, initialSettings: IBtSettings) => {
        fetch(CreateBehaviourTreeNodeAPI, {
            method: 'POST',
            body: JSON.stringify(
                {
                    assetId: props.assetId,
                    currentVersion: assetVersion,
                    position: position,
                    nodeType: nType,
                    initialSettings: initialSettings
                }
            )
        }).then(
            res => res.json()
        ).then(
            (res: CreateBehaviourTreeNodeResponse) => {
                if(res.errCode === 0) {
                    if(assetVersion !== res.modificationInfo.newVersion)
                    {
                        setDisplayNodes((prevState) => passModifiedNodeInfos(prevState, res.modificationInfo.diffNodesInfos))
                        SetAssetVersion(res.modificationInfo.newVersion);
                    }
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
                (res: RemoveBehaviourTreeNodeResponse) => {
                    if(res.errCode === 0) {
                        if(assetVersion !== res.modificationInfo.newVersion) {
                            setDisplayNodes((prevState) => passModifiedNodeInfos(prevState, res.modificationInfo.diffNodesInfos))
                            SetAssetVersion(res.modificationInfo.newVersion);
                        }
                    }
                }
            )
        }
    }

    const RequestDisconnectSelectedBehaviourTreeConnections = () => {
        let selectedEdge = edges.filter(m => m.selected);
        let waitToDisconnectChildIds = selectedEdge.map(m => m.target);
        if(waitToDisconnectChildIds.length > 0) {
            fetch(DisconnectBehaviourTreeNodeAPI, {
                method: 'POST',
                body: JSON.stringify(
                    {
                        assetId: props.assetId,
                        currentVersion: assetVersion,
                        childNodeIds: waitToDisconnectChildIds,
                    }
                )
            }).then(
                res => res.json()
            ).then(
                (res: RemoveBehaviourTreeNodeResponse) => {
                    if(res.errCode === 0) {
                        console.log(res.modificationInfo)
                        if(assetVersion !== res.modificationInfo.newVersion) {
                            setDisplayNodes((prevState) => passModifiedNodeInfos(prevState, res.modificationInfo.diffNodesInfos))
                            SetAssetVersion(res.modificationInfo.newVersion);
                        }
                    }
                }
            )
        }
    }

    const menuHelper: IBtAssetEditorMenuHelper = {
        CreateNode: RequestCreateBehaviourTreeNode,
        RemoveNodes: RequestRemoveSelectedBehaviourTreeNodes,
        Disconnect: RequestDisconnectSelectedBehaviourTreeConnections
    }

    //End Menu Helper

    //About Connections
    const OnConnecting = (connection: Connection) => {
        // Ensure Parent & Client
        let parentId = "";
        let clientId = "";
        if(connection.sourceHandle === "source" && connection.targetHandle === "target")
        {
            parentId = connection.source!;
            clientId = connection.target!;
        }
        else if(connection.sourceHandle === "target" && connection.targetHandle === "source")
        {
            parentId = connection.target!;
            clientId = connection.source!;
        }
        else{
            console.error(`err connection: ${JSON.stringify(connection)} `);
            return;
        }
        fetch(ConnectBehaviourTreeNodeAPI, {
            method: 'POST',
            body: JSON.stringify(
                {
                    assetId: props.assetId,
                    currentVersion: assetVersion,
                    parentNodeId: parentId,
                    childNodeId: clientId
                }
            )
        }).then(
            res => res.json()
        ).then(
            (res: ConnectBehaviourTreeNodeResponse) => {
                if(res.errCode === 0) {
                    if(assetVersion !== res.modificationInfo.newVersion)
                    {
                        console.log(res.modificationInfo.diffNodesInfos)
                        setDisplayNodes((prevState) => passModifiedNodeInfos(prevState, res.modificationInfo.diffNodesInfos))
                        SetAssetVersion(res.modificationInfo.newVersion);
                    }
                }
            }
        )
    }

    //End About Connections

    //Node/Edge Change Methods
    const OnCustomEdgeChange = (changes: EdgeChange[]) => {
        changes = changes.filter(m => m.type !== 'remove') //Skip remove TODO consider request disconnect here in future
        onEdgesChange(changes);
    }

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
        console.log("RequestMoveBehaviourTreeNodes Need Optimize");
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
                        setDisplayNodes((prevState) => passModifiedNodeInfos(prevState, res.modificationInfo.diffNodesInfos))
                        SetAssetVersion(res.modificationInfo.newVersion);
                    }
                }
            )
        }
    }

    //End Node Change Methods

    const GetSelectedNodeInfo = (): [string, string, IBtNodeConfigurableData | null] => {
        let selectedDisplayNodes = displayNodes.filter(m => m.selected);
        if(selectedDisplayNodes.length === 0) {
            return ["Empty Selected", "Empty Selected", null]
        }
        else if(selectedDisplayNodes.length === 1) {
            let selectedNode = selectedDisplayNodes[0];
            let configurableData: IBtNodeConfigurableData = {
                Settings: selectedNode.data.settings,
                Descriptions: selectedNode.data.descriptors,
                Services: selectedNode.data.services
            }
            return [selectedDisplayNodes[0].type!, selectedDisplayNodes[0].id, configurableData];
        }
        else {
            return ["Multiple Selected","Multiple Selected", null]
        }
    }
    let [selectedType, selectedId, configurableData] = GetSelectedNodeInfo();


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
                    onEdgesChange={OnCustomEdgeChange}
                    onNodeContextMenu={(e) => OnInvokeContextMenu(e, EditorContextMenuEnum.Node)}
                    onPaneContextMenu={(e) => OnInvokeContextMenu(e, EditorContextMenuEnum.Pane)}
                    onEdgeContextMenu={(e) => OnInvokeContextMenu(e, EditorContextMenuEnum.Edge)}
                    onNodeClick={(e) => OnInvokeContextMenu(e, EditorContextMenuEnum.None)}
                    onEdgeClick={(e) => OnInvokeContextMenu(e, EditorContextMenuEnum.None)}
                    onClick={(e) => OnInvokeContextMenu(e, EditorContextMenuEnum.None)}

                    onConnect={OnConnecting}

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
                                           solutionInfo={props.solutionInfo}
                    />
                </ReactFlow>
            </div>
            <div style={{width: "15%", height: "100%"}}>
                <BtNodeInspectorView DocVersion={assetVersion} NodeType={selectedType} InspectNodeId={selectedId} ConfigurableData={configurableData} Helper={inspectorHelper} SolutionDetailInfo={props.solutionInfo} />
            </div>
        </div>
    );
}


