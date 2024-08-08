import {Edge} from "@reactflow/core/dist/esm/types/edges";
import {Node} from "reactflow";
import {IBtcNodeData, IBttNodeData, ILogicBtdData} from "./BtLogicDS";

export type BtDisplayEdge = Edge<any>;
export type BtDisplayNode = Node<IBttNodeData | IBtcNodeData | null, string>;

export type IBtdDisplayData = ILogicBtdData

export type IBtdDisplaySummary = Pick<ILogicBtdData, 'id' | 'order' | 'btdType'>
