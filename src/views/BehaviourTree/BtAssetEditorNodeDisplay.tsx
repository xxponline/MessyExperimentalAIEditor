import {Handle, Node, NodeProps, Position} from "reactflow";

import "./BtAssetEditorNode.css"
import React from "react";
import {BtDisplayNode, BtDisplayNodeData} from "../../common/BtDisplayDS";




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
            {RenderDescriptor(nodeProps)}
            <div>BTC Type: Selector</div>
            <Handle type="source" position={Position.Bottom}/>
        </div>
    );
}

export function BTSequenceNode(nodeProps: NodeProps) {
    return (
        <div className={"sequence-node"} style={getCss(nodeProps)}>
            <Handle type="target" position={Position.Top}/>
            {RenderDescriptor(nodeProps)}
            <div>BTC Type: Sequence</div>
            <Handle type="source" position={Position.Bottom}/>
        </div>
    );
}

export function BTSimpleParallelNode(nodeProps: NodeProps<BtDisplayNodeData>) {
    return (
        <div className={"sequence-node"} style={getCss(nodeProps)}>
            <Handle type="target" position={Position.Top}/>
            <div>BTC Type: SimpleParallel</div>
            <Handle type="source" position={Position.Bottom}/>
            <Handle type="source" position={Position.Bottom}/>
        </div>
    );
}

export function BTTaskNode(nodeProps: NodeProps<BtDisplayNodeData>) {
    return (
        <div className={"task-node"} style={getCss(nodeProps)}>
            <Handle type="target" position={Position.Top}/>
            {RenderDescriptor(nodeProps)}
            <div>BTT Type: [{nodeProps.data.BttType}] [{nodeProps.data.Order}]</div>
        </div>
    );
}

function RenderDescriptor(nodeProps: NodeProps<BtDisplayNodeData>) : React.ReactNode
{
    if(nodeProps.data.descriptors.length > 0) {
        return(
            nodeProps.data.descriptors.map(d =>
                <div style={{ color: "blue", border: "1px solid blue", margin: "5px 0px", padding: "2px" }}>{d.BtdType} [{d.Order}]</div>
            )
        );
    }
    else {
        return(null);
    }
}
// function RenderItem(key: string, value: any) : React.ReactNode {
//     return (<div>{key}</div>);
// }
