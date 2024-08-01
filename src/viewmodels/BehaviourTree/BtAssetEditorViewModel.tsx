import React from "react";
import {BtAssetEditorView} from "../../views/BehaviourTree/BtAssetEditorView";
import {EdgeChange, NodeChange, NodePositionChange, NodeRemoveChange} from "reactflow";
import {NodeSelectionChange} from "@reactflow/core/dist/esm/types/changes";
import {BehaviourTreeModel, IBtContentChangedListener} from "../../models/BehaviourTreeModel";
import {BtDisplayEdge, BtDisplayNode} from "../../views/BehaviourTree/BtAssetEditorNodeDisplay";
import {BtNodeType} from "../../common/BtCommon";
import {EditorPosition} from "../../common/EditorCommon";
import { ILogicBtNode, ILogicBtConnection } from "../../models/BtLogicDataStructure";
import {Connection} from "@reactflow/core/dist/esm/types/general";

interface IBtEditorClassState {
    Nodes: BtDisplayNode[];
    Edges: BtDisplayEdge[];
}

export interface IBtAssetEditorHelper {
    CreateNode(type: BtNodeType, pos: EditorPosition): void;

    RemoveNode(nodeIds: string[]): void;

    LinkNode(source: string, target: string): void;

    Duplicate(nodeIds: string[]): void;

    Copy(nodeIds: string[]): void;

    Paste(pos: EditorPosition): void;
}

export interface IBtAssetEditorRenderProps {
    Nodes: BtDisplayNode[];
    Edges: BtDisplayEdge[];

    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onConnect: (connection: Connection) => void;

    editorHelper: IBtAssetEditorHelper;
}

export class BtAssetEditorViewModel extends React.Component<{}, IBtEditorClassState>
    implements IBtContentChangedListener, IBtAssetEditorHelper {
    constructor(props: React.ComponentProps<any>) {
        super(props);
        this.state = {
            Nodes: [],
            Edges: []
        }
    }

    //EditorHelper
    CreateNode(type: BtNodeType, pos: EditorPosition): void {
        BehaviourTreeModel.Instance.CreateNodeInEditingDocument(type, pos);
    }
    RemoveNode(nodeIds: string[]): void {
        BehaviourTreeModel.Instance.RemoveNodeInEditingDocument(nodeIds);
    }
    LinkNode(source: string, target: string): void {
        throw new Error("Method not implemented.");
    }
    Duplicate(nodeIds: string[]): void {
        throw new Error("Method not implemented.");
    }
    Copy(nodeIds: string[]): void {
        throw new Error("Method not implemented.");
    }
    Paste(pos: EditorPosition): void {
        throw new Error("Method not implemented.");
    }
    //End EditorHelper


    //Content Change Listener
    OnCreateNewNode(nodes: Readonly<ILogicBtNode>[]): void {
        let newDisplayNodes = nodes.map<BtDisplayNode>((n) => {
            return {
                id: n.id,
                type: n.type,
                position: n.position,
                data: n.data,
            }
        });
        this.setState((preState) => (
            { Nodes: preState.Nodes.concat(newDisplayNodes) }
        ));
    }

    OnNodeLinked(connections: Readonly<ILogicBtConnection>[]): void {
        let additionEdges : BtDisplayEdge[] = connections.map((c) => {
            let newEdge : BtDisplayEdge = {
                id: c.id,
                source: c.source,
                target: c.target
            }
            return newEdge;
        });
        this.setState((preState) => (
            { Edges: preState.Edges.concat(additionEdges) }
        ))
    }

    OnRemoveElement(nodeIds: string[], connectionIds: string[]): void {
        this.setState((preState) => (
            {
                Nodes: preState.Nodes.filter((n) => !nodeIds.includes(n.id)),
                Edges: preState.Edges.filter((c) => !connectionIds.includes(c.id)),
            }
        ));
    }

    OnCurrentEditingBtDocumentChanged(): void {
        let [logicNodes, logicConnections] = BehaviourTreeModel.Instance.GetEditingBtAssetContent();
        // console.log(logicNodes);
        let displayNodes = logicNodes.map<BtDisplayNode>((n) => {
            return {
                id: n.id,
                type: n.type,
                position: n.position,
                data: n.data,
            }
        });
        let displayConnections = logicConnections.map<BtDisplayEdge>((c) => {
            return {
                id: c.id,
                source: c.source,
                target: c.target,
            }
        });

        this.setState({ Nodes: displayNodes, Edges: displayConnections});
    }
    //End Content Change Listener


    //ReactFlow Need Method

    onNodesChange(changes: NodeChange[]) {
        let selectChangeItems : NodeSelectionChange[] = [];
        let positionChangeItems : NodePositionChange[] = [];
        let removeChangeItems : NodeRemoveChange[] = [];

        for(let changeItem of changes) {
            switch (changeItem.type) {
                case "select":
                {
                    selectChangeItems.push(changeItem);
                }
                    break;
                case "position":
                {
                    positionChangeItems.push(changeItem);
                }
                    break;
                case "dimensions":
                    //there nothing to do when get dimensions NodeChange event
                    break;
                case "remove":
                    removeChangeItems.push(changeItem);
                    break;
                default:
                    console.error(changeItem);
                    //BehaviourTreeModel.Instance
                    break;
            }
        }


        ////
        let hasSelecting = false;
        for(let changeItem of selectChangeItems) {
            hasSelecting = true;
            for( let node of this.state.Nodes) {
                if (changeItem.id === node.id) {
                    node.selected = changeItem.selected;
                }
            }
        }

        if (hasSelecting) {
            let selectedNodes = this.state.Nodes.filter((n) => n.selected === true);
            if (selectedNodes.length === 1) {
                BehaviourTreeModel.Instance.InspectNodeDetail(selectedNodes[0].id);
            }
            else{
                BehaviourTreeModel.Instance.InspectNodeDetail(null);
            }
        }
        ////

        ////
        for(let changeItem of positionChangeItems) {
            this.setState((prevState) => ({
                Nodes: prevState.Nodes.map((node) => {
                    let result = node;
                    if(changeItem.id === node.id) {
                        if(changeItem.dragging === true) {
                            result.position = changeItem.position!;
                            result.positionAbsolute = changeItem.positionAbsolute;
                        }
                        else {
                            BehaviourTreeModel.Instance.MoveNode({Id: node.id, ...node.position});
                        }
                    }
                    return result;
                }),
            }));
        }
        ////

        //// Remove
        if(removeChangeItems.length > 0) {
            BehaviourTreeModel.Instance.RemoveNodeInEditingDocument(removeChangeItems.map(m => m.id));
        }
        ////

    }

    onEdgesChange(changes: EdgeChange[]) {
        for(let changeItem of changes) {
            switch (changeItem.type) {
                default:
                    //console.log(changeItem);
                    break;
            }
        }
    }

    onConnect(connection: Connection) {
        if(connection.source !== null && connection.target !== null) {
            BehaviourTreeModel.Instance.LinkNodeInEditingDocument(connection.source, connection.target);
        }
    }

    componentDidMount() {
        BehaviourTreeModel.Instance.RegisterBtDocumentEditorListener(this);
    }

    componentWillUnmount() {
        BehaviourTreeModel.Instance.RemoveBtDocumentEditorListener(this);
    }

    render() {
        let renderProps: IBtAssetEditorRenderProps = {
            Nodes: this.state.Nodes,
            Edges: this.state.Edges,

            editorHelper: this,

            onNodesChange: (changes : NodeChange[]) => this.onNodesChange(changes),
            onEdgesChange: (changes : EdgeChange[]) => this.onEdgesChange(changes),
            onConnect: (connection: Connection) => this.onConnect(connection)
        }
        return (
            <div style={{width: "100%", height: "100%"}}>
                <div><button onClick={() => {BehaviourTreeModel.Instance.RequestSaveCurrentBtDocumentation().then()}} >Save</button> </div>
                <div style={{width: "100%", height: "100%"}} >
                    <BtAssetEditorView {...renderProps} />
                </div>
            </div>
        );
    }


    //
}
