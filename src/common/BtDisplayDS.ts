import {Edge} from "@reactflow/core/dist/esm/types/edges";
import {Node} from "reactflow";
import {IBtcNodeData, IBttNodeData, ILogicBtdData, ILogicBtsData} from "./BtLogicDS";

export type BtDisplayEdge = Edge;
export type BtDisplayNodeData = { taskType: string, order: number, descriptors: IBtdDisplaySummary[], services: IBtsDisplaySummary[], behaviourTreeParentId: string};
export type BtDisplayNode = Node<BtDisplayNodeData, string>;

export type IBtdDisplayNode = ILogicBtdData & { id: string }
export type IBtdDisplaySummary = Pick<ILogicBtdData, 'Order' | 'BtdType'>

export type IBtsDisplayNode = ILogicBtsData & { id: string }
export type IBtsDisplaySummary = Pick<ILogicBtsData, 'Order' | 'BtdType'>

export type IAssetSummaryForTab = { assetId: string, assetName: string, assetType: string }
