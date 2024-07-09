export class BtAssetSummary {
    public assetPath!: string;
    public assetGuid!: string;
}

export class BtAssetDetail {
    public assetPath!: string;
    public assetGuid!: string;
    public modifyTimeStamp!: number;
    public btNodes: any;
    public btConnections: any;
}
