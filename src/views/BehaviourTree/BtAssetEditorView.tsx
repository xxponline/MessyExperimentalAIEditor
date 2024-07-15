import React, {ReactNode} from "react";
import ReactFlow, {Background, Controls, MiniMap} from "reactflow";
import 'reactflow/dist/style.css';
import {IBtAssetEditorRenderProps} from "../../viewmodels/BehaviourTree/BtAssetEditorViewModel";
import {
    BTRootNode,
    BTSelectorNode,
    BTSequenceNode,
    BTSimpleParallelNode, BTTaskNode
} from "../../behaviour_tree_editor_view/behaviour_tree_node_display";

const nodeTypes = {
    "bt_root" : BTRootNode,
    "bt_selector" : BTSelectorNode,
    "bt_sequence" : BTSequenceNode,
    "bt_simpleParallel" : BTSimpleParallelNode,
    "bt_task" : BTTaskNode
};


export class BtAssetEditorView extends React.Component<IBtAssetEditorRenderProps, {}>{
    render() {
        return(
            <ReactFlow
                nodes={this.props.Nodes}
                edges={this.props.Edges}
                onNodesChange={this.props.onNodesChange}
                //onEdgesChange={onEdgesChange}
                //onNodeContextMenu={onNodeContextMenu}
                //onPaneContextMenu={onPaneContextMenu}
                //onEdgeContextMenu={onEdgeContextMenu}
                //onNodeClick={onCancelMenu}
                //onEdgeClick={(event, node) => onCancelMenu}
                //onClick={onCancelMenu}

                //onConnect={onLink}

                selectionOnDrag={true}
                panOnDrag={false}

                nodeTypes={nodeTypes}
            >
                <Controls/>
                {/*<MiniMap/>*/}
                <Background gap={12} size={1}/>
                {/*(helper.editorContextType !== EditorContextEnum.none) && <BehaviourTreeContextMenu helper={helper}/>*/}
            </ReactFlow>
        )
    }
}
