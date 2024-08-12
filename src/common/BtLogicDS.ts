import {BtNodeType} from "../common/BtCommon";

export interface IBttNodeData {
    BttType: string,
    Order: number,
    // Additional members with unknown keys
    [key: string]: any
}

export interface IBtcNodeData {
    Order: number,
    [key: string]: any
}

export interface ILogicBtNode {
    id: string,
    position: { x: number, y: number },
    type: BtNodeType,
    data: IBttNodeData | IBtcNodeData | null
}

export interface ILogicBtdNode {
    id: string,
    attachTo: string,
    data: ILogicBtdData;
}

export interface ILogicBtdData {
    Order: number,
    BtdType: string,
    // Additional members with unknown keys
    [key: string]: any
}

export interface ILogicBtsNode {
    id: string,
    attachTo: string,
    data: ILogicBtsData
}

export interface ILogicBtsData {
    Order: number,
    BtsType: string,
    // Additional members with unknown keys
    [key: string]: any
}

export interface ILogicBtConnection {
    id: string,
    source: string,
    target: string,
}

export class BtAssetSummary {
    public assetPath!: string;
    public assetGuid!: string;
}

export class BtAssetDetail {
    public assetPath!: string;
    public assetGuid!: string;
    public modifyTimeStamp!: number;
    public btNodes!: Array<ILogicBtNode>;
    public btConnections!: Array<ILogicBtConnection>;
    public btDescriptors!: Array<ILogicBtdNode>;
}
