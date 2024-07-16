import React, {ReactNode} from "react";
import ReactFlow, {Background, Controls, MiniMap} from "reactflow";
import 'reactflow/dist/style.css';
import {IBtAssetEditorRenderProps} from "../../viewmodels/BehaviourTree/BtAssetEditorViewModel";
import {
    BTRootNode,
    BTSelectorNode,
    BTSequenceNode,
    BTSimpleParallelNode, BTTaskNode
} from "./BtAssetEditorNodeDisplay";

const nodeTypes = {
    "bt_root" : BTRootNode,
    "bt_selector" : BTSelectorNode,
    "bt_sequence" : BTSequenceNode,
    "bt_simpleParallel" : BTSimpleParallelNode,
    "bt_task" : BTTaskNode
};


export class BtAssetEditorView extends React.Component<IBtAssetEditorRenderProps, {}>{

    OnNodeContextMenu() {
        console.log(this.props);
    }

    OnPaneContextMenu() {
        console.log(this.props);
    }

    OnEdgeContextMenu() {
        console.log(this.props);
    }

    render() {
        return(
            <ReactFlow
                nodes={this.props.Nodes}
                edges={this.props.Edges}
                onNodesChange={this.props.onNodesChange}
                //onEdgesChange={onEdgesChange}
                onNodeContextMenu={ (e) => {this.OnNodeContextMenu()} }
                onPaneContextMenu={ (e) => {this.OnPaneContextMenu()} }
                onEdgeContextMenu={ (e) => {this.OnEdgeContextMenu()} }
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
