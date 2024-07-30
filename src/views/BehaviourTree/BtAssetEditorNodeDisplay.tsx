import {Handle, Node, NodeProps, Position} from "reactflow";
import {Edge} from "@reactflow/core/dist/esm/types/edges";

import "./BtAssetEditorNode.css"
import {IBtNodeData} from "../../models/BtLogicDataStructure";
import React from "react";

export type BtDisplayEdge = Edge<any>;
export type BtDisplayNode = Node<IBtNodeData, string>;


function getCss(nodeProps: NodeProps): React.CSSProperties {
    let st : { backgroundColor: string } = { backgroundColor: "#fff" };
    if(nodeProps.selected){
        st = { backgroundColor: "#888" }
    }
    return st;
}

export function BTRootNode(nodeProps: NodeProps) {
    return (
        <div className={"root-node"} style={getCss(nodeProps)}>
            <div>Root</div>
            <Handle type="source" position={Position.Bottom}/>
        </div>
    );
}

export function BTSelectorNode(nodeProps: NodeProps) {
    return (
        <div className={"selector-node"} style={getCss(nodeProps)}>
            <Handle type="target" position={Position.Top}/>
            <div>Selector</div>
            <Handle type="source" position={Position.Bottom}/>
        </div>
    );
}

export function BTSequenceNode(nodeProps: NodeProps) {
    return (
        <div className={"sequence-node"} style={getCss(nodeProps)}>
            <Handle type="target" position={Position.Top}/>
            <div>Sequence</div>
            <Handle type="source" position={Position.Bottom}/>
        </div>
    );
}

export function BTSimpleParallelNode(nodeProps: NodeProps) {
    return (
        <div className={"sequence-node"} style={getCss(nodeProps)}>
            <Handle type="target" position={Position.Top}/>
            <div>SimpleParallel</div>
            <Handle type="source" position={Position.Bottom}/>
            <Handle type="source" position={Position.Bottom}/>
        </div>
    );
}

export function BTTaskNode(nodeProps: NodeProps) {
    return (
        <div className={"task-node"} style={getCss(nodeProps)}>
            <Handle type="target" position={Position.Top}/>
            <div>Type: [{nodeProps.data.BttType}]</div>
            {/*{Object.entries(nodeProps.data).map(([key, item]) => RenderItem(key, item))}*/}
        </div>
    );
}

// function RenderItem(key: string, value: any) : React.ReactNode {
//     return (<div>{key}</div>);
// }
