import {Edge} from "@reactflow/core/dist/esm/types/edges";
import {Node} from "reactflow";
import {IBtcNodeData, IBttNodeData, ILogicBtdData, ILogicBtsData} from "./BtLogicDS";

export type BtDisplayEdge = Edge<any>;
export type BtDisplayNode = Node<IBttNodeData | IBtcNodeData | null, string>;

export type IBtdDisplayNode = ILogicBtdData & { id: string }
export type IBtdDisplaySummary = Pick<ILogicBtdData, 'Order' | 'BtdType'>

export type IBtsDisplayNode = ILogicBtsData & { id: string }
export type IBtsDisplaySummary = Pick<ILogicBtsData, 'Order' | 'BtdType'>
