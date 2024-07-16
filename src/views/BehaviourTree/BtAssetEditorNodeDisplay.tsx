import {Handle, Node, NodeProps, Position} from "reactflow";
import {Edge} from "@reactflow/core/dist/esm/types/edges";

import "./BtAssetEditorNode.css"
import {IBtNodeData} from "../../models/BtLogicDataStructure";

export type BtDisplayEdge = Edge<any>;
export type BtDisplayNode = Node<IBtNodeData, string>;


export function BTRootNode(nodeProps: NodeProps<BtDisplayNode>) {
    return (
        <div className={"root-node"}>
            <div>Root</div>
            <Handle type="source" position={Position.Bottom}/>
        </div>
    );
}

export function BTSelectorNode(node: NodeProps<BtDisplayNode>) {
    return (
        <div className={"selector-node"}>
            <Handle type="target" position={Position.Top}/>
            <div>Selector</div>
            <Handle type="source" position={Position.Bottom}/>
        </div>
    );
}

export function BTSequenceNode(node: NodeProps<BtDisplayNode>) {
    return (
        <div className={"sequence-node"}>
            <Handle type="target" position={Position.Top}/>
            <div>Sequence</div>
            <Handle type="source" position={Position.Bottom}/>
        </div>
    );
}

export function BTSimpleParallelNode(node: NodeProps<BtDisplayNode>) {
    return (
        <div className={"sequence-node"}>
            <Handle type="target" position={Position.Top}/>
            <div>SimpleParallel</div>
            <Handle type="source" position={Position.Bottom}/>
            <Handle type="source" position={Position.Bottom}/>
        </div>
    );
}

export function BTTaskNode(node: NodeProps<BtDisplayNode>) {
    return (
        <div className={"task-node"}>
            <Handle type="target" position={Position.Top}/>
            <div>Task</div>
            <Handle type="source" position={Position.Bottom}/>
        </div>
    );
}
