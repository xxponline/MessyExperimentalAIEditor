import React from "react";
import {Node} from "reactflow";
import {Edge} from "@reactflow/core/dist/esm/types/edges";
import {BTNode, BTNodeData} from "./behaviour_tree_node_display";

export type SetNodesAction = React.Dispatch<React.SetStateAction<BTNode[]>>;
export type SetEdgesAction = React.Dispatch<React.SetStateAction<Edge[]>>;
export type MenuLocalInfo = { x: number, y: number, left?: number, right?: number, top?: number, bottom?: number }

export enum EditorContextEnum {
    none,
    pane,
    node,
    edge
}

export enum MenuDirection
{
    RightDown,
    LeftDown,
    RightUp,
    LeftUp
}

export enum BTNodeType
{
    Root,
    Selector,
    Sequence,
    SimpleParallel,
    Task
}
