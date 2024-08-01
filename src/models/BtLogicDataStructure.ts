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
}
