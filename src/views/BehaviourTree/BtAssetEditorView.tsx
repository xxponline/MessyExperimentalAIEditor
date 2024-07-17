import React from "react";
import ReactFlow, {Background, Controls} from "reactflow";
import 'reactflow/dist/style.css';
import {IBtAssetEditorRenderProps} from "../../viewmodels/BehaviourTree/BtAssetEditorViewModel";
import {BTRootNode, BTSelectorNode, BTSequenceNode, BTSimpleParallelNode, BTTaskNode} from "./BtAssetEditorNodeDisplay";
import {BtAssetEditorMenuView, EditorContextMenuEnum, MenuDirection} from "./BtAssetEditorMenuView";

const nodeTypes = {
    "bt_root" : BTRootNode,
    "bt_selector" : BTSelectorNode,
    "bt_sequence" : BTSequenceNode,
    "bt_simpleParallel" : BTSimpleParallelNode,
    "bt_task" : BTTaskNode
};


export class BtAssetEditorView extends React.Component<IBtAssetEditorRenderProps,
    { contextMenu: EditorContextMenuEnum, menuDir: MenuDirection, position: { x: number, y: number}}>{
    constructor(props:IBtAssetEditorRenderProps) {
        super(props);
        this.state = { contextMenu: EditorContextMenuEnum.None,
            menuDir: MenuDirection.RightDown,
            position: { x: 0, y: 0 },
        };
    }
    private elementRef: React.RefObject<HTMLDivElement> = React.createRef();

    OnNodeContextMenu(e: React.MouseEvent<Element, MouseEvent>) {
        e.preventDefault();
        let viewRectangle = this.elementRef.current!.getBoundingClientRect();
        this.setState({contextMenu: EditorContextMenuEnum.Node, position: { x: e.clientX - viewRectangle.x, y: e.clientY - viewRectangle.y }});
    }

    OnPaneContextMenu(e: React.MouseEvent<Element, MouseEvent>) {
        e.preventDefault();
        let viewRectangle = this.elementRef.current!.getBoundingClientRect();
        this.setState({contextMenu: EditorContextMenuEnum.Pane, position: { x: e.clientX - viewRectangle.x, y: e.clientY - viewRectangle.y }});
    }

    OnEdgeContextMenu(e: React.MouseEvent<Element, MouseEvent>) {
        e.preventDefault();
        let viewRectangle = this.elementRef.current!.getBoundingClientRect();
        this.setState({contextMenu: EditorContextMenuEnum.Edge, position: { x: e.clientX - viewRectangle.x, y: e.clientY - viewRectangle.y }});
    }

    OnCancelContextMenu(e: React.MouseEvent<Element, MouseEvent>) {
        e.preventDefault();
        this.setState({contextMenu: EditorContextMenuEnum.None});
    }

    render() {
        return(
            <ReactFlow
                ref={this.elementRef}
                nodes={this.props.Nodes}
                edges={this.props.Edges}
                onNodesChange={this.props.onNodesChange}
                onEdgesChange={this.props.onEdgesChange}
                onNodeContextMenu={ (e) => {this.OnNodeContextMenu(e)} }
                onPaneContextMenu={ (e) => {this.OnPaneContextMenu(e)} }
                onEdgeContextMenu={ (e) => {this.OnEdgeContextMenu(e)} }
                onNodeClick={(e) => {this.OnCancelContextMenu(e)}}
                onEdgeClick={(e) => {this.OnCancelContextMenu(e)}}
                onClick={(e) => {this.OnCancelContextMenu(e)}}

                onConnect={this.props.onConnect}

                selectionOnDrag={true}
                panOnDrag={false}

                nodeTypes={nodeTypes}
            >
                <Controls/>
                {/*<MiniMap/>*/}
                <Background gap={12} size={1}/>
                <BtAssetEditorMenuView contextMenu={this.state.contextMenu}
                                       dirMenu={this.state.menuDir} position={this.state.position}
                                       editorHelper={this.props.editorHelper}
                />
            </ReactFlow>
        )
    }
}
