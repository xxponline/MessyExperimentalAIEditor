import React from "react";
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";
import {BtAssetEditorView} from "../../views/BehaviourTree/BtAssetEditorView";
import {NodeChange, NodePositionChange} from "reactflow";
import {NodeSelectionChange} from "@reactflow/core/dist/esm/types/changes";
import {BehaviourTreeModel, IBtEditorListener} from "../../models/BehaviourTreeModel";
import {BtDisplayEdge, BtDisplayNode} from "../../views/BehaviourTree/BtAssetEditorNodeDisplay";

interface IBtEditorClassState {
    Nodes: BtDisplayNode[];
    Edges: BtDisplayEdge[];
}

export interface IBtAssetEditorRenderProps {
    Nodes: BtDisplayNode[];
    Edges: BtDisplayEdge[];

    onNodesChange: (nodes: NodeChange[]) => void;
}

const rootId = generateUniqueID();
const firstNodeId = generateUniqueID();
const initialNodes : BtDisplayNode[]  = [
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

    setNodes(nodes : BtDisplayNode[]) {
        this.setState({ Nodes: nodes });
    }

    setEdges(edges : BtDisplayEdge[]) {
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
        BehaviourTreeModel.Instance.RegisterBtDocumentEditorListener(this);
    }

    componentWillUnmount() {
        BehaviourTreeModel.Instance.RemoveBtDocumentEditorListener(this);
    }

    OnCurrentEditingBtDocumentChanged(): void {
        let [logicNodes, logicConnections] = BehaviourTreeModel.Instance.GetEditingBtAssetContent();
        console.log(logicNodes);
        let displayNodes = logicNodes.map<BtDisplayNode>((n) => {
            return {
                id: n.id,
                type: n.type,
                position: n.position,
                data: {},
            }
        });
        let displayConnections = logicConnections.map<BtDisplayEdge>((c) => {
           return {
               id: c.id,
               source: c.source,
               target: c.target,
           }
        });

        console.log(displayNodes);

        this.setState({ Nodes: displayNodes, Edges: displayConnections});
    }

    render() {
        let renderProps: IBtAssetEditorRenderProps = {
            Nodes: this.state.Nodes,
            Edges: this.state.Edges,

            onNodesChange: (changes : NodeChange[]) => this.onNodesChange(changes)
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
