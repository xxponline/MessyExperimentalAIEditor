import {Handle, Node, NodeProps, Position} from "reactflow";
import {Edge} from "@reactflow/core/dist/esm/types/edges";

import "./behaviour_tree_node.css"

export type BTEdge = Edge<any>;

export type BTNodeData = { }
export type BTNode = Node<BTNodeData, string>;

type NodeParam = { data: BTNodeData, isConnectable: boolean };

export function BTRootNode(nodeProps: NodeProps<BTNode>) {
    return (
        <div className={"root-node"}>
            <div>Root</div>
            <Handle type="source" position={Position.Bottom}/>
        </div>
    );
}

export function BTSelectorNode(node: NodeProps<BTNode>) {
    return (
        <div className={"selector-node"}>
            <Handle type="target" position={Position.Top}/>
            <div>Selector</div>
            <Handle type="source" position={Position.Bottom}/>
        </div>
    );
}

export function BTSequenceNode(node: NodeProps<BTNode>) {
    return (
        <div className={"sequence-node"}>
            <Handle type="target" position={Position.Top}/>
            <div>Sequence</div>
            <Handle type="source" position={Position.Bottom}/>
        </div>
    );
}

export function BTSimpleParallelNode(node: NodeProps<BTNode>) {
    return (
        <div className={"sequence-node"}>
            <Handle type="target" position={Position.Top}/>
            <div>SimpleParallel</div>
            <Handle type="source" position={Position.Bottom}/>
            <Handle type="source" position={Position.Bottom}/>
        </div>
    );
}

export function BTTaskNode(node: NodeProps<BTNode>) {
    return (
        <div className={"task-node"}>
            <Handle type="target" position={Position.Top}/>
            <div>Task</div>
            <Handle type="source" position={Position.Bottom}/>
        </div>
    );
}
