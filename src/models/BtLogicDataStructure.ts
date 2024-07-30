export interface IBtNodeData {
    BttType: string
}

export interface ILogicBtNode {
    id: string,
    position: { x: number, y: number },
    type: string,
    data: any
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
