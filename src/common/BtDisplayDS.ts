import {Edge} from "@reactflow/core/dist/esm/types/edges";
import {Node} from "reactflow";
import {IBtcNodeData, IBttNodeData, ILogicBtdData, ILogicBtsData} from "./BtLogicDS";

export type BtDisplayEdge = Edge<any>;
export type BtDisplayNodeData = (IBttNodeData | IBtcNodeData) & { descriptors: IBtdDisplaySummary[], services: IBtsDisplaySummary[]};
export type BtDisplayNode = Node<BtDisplayNodeData, string>;

export type IBtdDisplayNode = ILogicBtdData & { id: string }
export type IBtdDisplaySummary = Pick<ILogicBtdData, 'Order' | 'BtdType'>

export type IBtsDisplayNode = ILogicBtsData & { id: string }
export type IBtsDisplaySummary = Pick<ILogicBtsData, 'Order' | 'BtdType'>
