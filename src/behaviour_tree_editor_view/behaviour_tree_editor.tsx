import React, {type MouseEvent as ReactMouseEvent, useCallback, useRef, useState} from "react";
import ReactFlow, {Background, Connection, Controls, MiniMap, Node, useEdgesState, useNodesState} from "reactflow";
import {Edge} from "@reactflow/core/dist/esm/types/edges";

import 'reactflow/dist/style.css';
import BehaviourTreeContextMenu from "./behaviour_tree_context_menu";
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";
import {BehaviourTreeEditHelper} from "./behaviour_tree_edit_helper";
import {
    BTEdge,
    BTNode,
    BTRootNode,
    BTSelectorNode,
    BTSequenceNode,
    BTSimpleParallelNode,
    BTTaskNode
} from "./behaviour_tree_node_display";
import {BTNodeType, EditorContextEnum} from "./behaviour_tree_type_define";
import {NetManager} from "../service/NetManager";
import {BehaviourTreeModel} from "../models/BehaviourTreeModel";


const nodeTypes = {
    "bt_root" : BTRootNode,
    "bt_selector" : BTSelectorNode,
    "bt_sequence" : BTSequenceNode,
    "bt_simpleParallel" : BTSimpleParallelNode,
    "bt_task" : BTTaskNode
};

const rootId = generateUniqueID();
const firstNodeId = generateUniqueID();
const initialNodes : BTNode[]  = [
    { id: rootId, type: "bt_root", position: { x: 0, y: 0 }, data: {} },
    { id: firstNodeId, type: "bt_sequence", position: { x: 0, y: 0 }, data: {} },
];
const initialEdges = [{ id: generateUniqueID(), source: rootId, target: firstNodeId }];

NetManager.Instance.Init();
BehaviourTreeModel.Instance.Init();

export default function BehaviourTreeEditorView(){

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [editorContext, setEditorContext] = useState(EditorContextEnum.none);
    const [menuPosition, setMenuPosition] = useState({x : 0, y : 0});
    const [selectedNodes, setSelectedNodes] = useState<Array<BTNode>>();
    const [selectedEdges, setSelectedEdges] = useState<Array<BTEdge>>();

    const helper = new BehaviourTreeEditHelper(nodes,edges, setNodes, setEdges)
        .EditorContextType(editorContext)
        .Position(menuPosition.x, menuPosition.y);
    switch (helper.editorContextType)
    {
        case EditorContextEnum.none:
            break;
        case EditorContextEnum.node:
            helper.SelectNodes(selectedNodes ?? []);
            break;
        case EditorContextEnum.edge:
            helper.SelectEdges(selectedEdges ?? []);
            break;
        case EditorContextEnum.pane:
            break;
    }

    const ref = useRef<Element>(null)
    const onNodeContextMenu = useCallback(
        (event : ReactMouseEvent, node : Node) => {
            // Prevent native context menu from showing
            event.preventDefault();

            // Calculate position of the context menu. We want to make sure it
            // doesn't get positioned off-screen.
            const pane = ref.current?.getBoundingClientRect();
            if(pane !== null) {
                setEditorContext(EditorContextEnum.node);
                setMenuPosition({x: event.clientX, y: event.clientY});
                setSelectedNodes([node]);
            }
        },
        [setEditorContext, setMenuPosition],
    );

    const onPaneContextMenu = useCallback(
        (event: React.MouseEvent<Element, MouseEvent>) => {
            event.preventDefault();

            const pane = ref.current?.getBoundingClientRect();
            if(pane !== null) {
                setEditorContext(EditorContextEnum.pane);
                setMenuPosition({x: event.clientX, y: event.clientY});
            }
        }
    , [setEditorContext, setMenuPosition]);

    const onEdgeContextMenu = useCallback(
        (event: ReactMouseEvent, edge: Edge) => {
            event.preventDefault();

            const pane = ref.current?.getBoundingClientRect();
            if(pane !== null) {
                setEditorContext(EditorContextEnum.edge);
                setMenuPosition({x: event.clientX, y: event.clientY});
                setSelectedEdges([edge]);
            }
        }
    ,[setEditorContext, setMenuPosition]);

    const onCancelMenu = useCallback(
        ()=>{
            setEditorContext(EditorContextEnum.none);
        }
    , [setEditorContext]);

    const onLink = useCallback((connection: Connection) => helper.Link(connection),[helper]);

    return (
        <div style={{width: '100vw', height: '100vh'}}>
            <button onClick={() => {
                BehaviourTreeModel.Instance.RequestBehaviourTreesAssetsList().then(
                    (ack) => console.log(ack)
            );
            }}>ListAssets
            </button>
            <button onClick={() => {

            }}>New
            </button>
            <button onClick={() => {
                helper.SaveBehaviourTree()
            }}>Save
            </button>
            <button onClick={() => {

            }}>Load
            </button>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeContextMenu={onNodeContextMenu}
                onPaneContextMenu={onPaneContextMenu}
                onEdgeContextMenu={onEdgeContextMenu}
                onNodeClick={onCancelMenu}
                onEdgeClick={(event, node) => onCancelMenu}
                onClick={onCancelMenu}

                onConnect={onLink}

                selectionOnDrag={true}
                panOnDrag={false}

                nodeTypes={nodeTypes}
            >
                <Controls/>
                <MiniMap/>
                <Background gap={12} size={1}/>
                {(helper.editorContextType !== EditorContextEnum.none) && <BehaviourTreeContextMenu helper={helper}/>}
            </ReactFlow>
        </div>
    );
}
