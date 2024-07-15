import React from "react";
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";
import {BTEdge, BTNode} from "../../behaviour_tree_editor_view/behaviour_tree_node_display";
import {BtAssetEditorView} from "../../views/BehaviourTree/BtAssetEditorView";
import {NodeChange, NodePositionChange} from "reactflow";
import {NodeSelectionChange} from "@reactflow/core/dist/esm/types/changes";
import {IBtEditorListener} from "../../models/BehaviourTreeModel";

interface IBtEditorClassState {
    Nodes: BTNode[];
    Edges: BTEdge[];
}

export interface IBtAssetEditorRenderProps {
    Nodes: BTNode[];
    Edges: BTEdge[];

    onNodesChange: (nodes: NodeChange[]) => void;
}

const rootId = generateUniqueID();
const firstNodeId = generateUniqueID();
const initialNodes : BTNode[]  = [
    { id: rootId, type: "bt_root", position: { x: 10, y: 10 }, data: {} },
    { id: firstNodeId,  type: "bt_sequence", position: { x: 100, y: 100 }, data: {} },
];
const initialEdges = [{ id: generateUniqueID(), source: rootId, target: firstNodeId }];

export class BtAssetEditorViewModel extends React.Component<{},IBtEditorClassState>
    implements IBtEditorListener {
    constructor(props: React.ComponentProps<any>) {
        super(props);
        this.state = {
            Nodes: initialNodes,
            Edges: initialEdges
        }

        this.setNodes.bind(this);
        this.setEdges.bind(this);
        this.onNodesChange.bind(this);
    }

    OnCurrentEditingBtDocumentChanged(): void {
        console.log("111111");
    }

    setNodes(nodes : BTNode[]) {
        this.setState({ Nodes: nodes });
    }

    setEdges(edges : BTEdge[]) {
        this.setState( { Edges: edges})
    }

    onNodesChange(changes : NodeChange[]) {
        for(let changeItem of changes) {
            switch (changeItem.type) {
                case "select":
                {
                    let changeDetailItem: NodeSelectionChange = changeItem;
                    this.setState((prevState) => ({
                        Nodes: prevState.Nodes.map((node) => {
                            return changeDetailItem.id === node.id ? {...node, selected: changeDetailItem.selected} : node;
                        }),
                    }));
                }
                    break;
                case "position":
                {
                    let changeDetailItem: NodePositionChange = changeItem;
                    this.setState((prevState) => ({
                        Nodes: prevState.Nodes.map((node) => {
                            let result = node;
                            if(changeDetailItem.id === node.id) {
                                if(changeDetailItem.position) {
                                    result.position = changeDetailItem.position;
                                }
                                if(changeDetailItem.positionAbsolute) {
                                    result.positionAbsolute = changeDetailItem.positionAbsolute;
                                }
                            }
                            return result;
                        }),
                    }));
                }
                    break;
                case "remove":
                    console.log(changeItem);
                    //BehaviourTreeModel.Instance
                    break;
            }
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        let renderProps: IBtAssetEditorRenderProps = {
            Nodes: this.state.Nodes,
            Edges: this.state.Edges,

            onNodesChange: (changes : NodeChange[]) => this.onNodesChange(changes)
        }
        return (<BtAssetEditorView {...renderProps} />);
    }
}
