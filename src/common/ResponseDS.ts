import {ILogicBtNode} from "./BtLogicDS";

export interface ServerCommonResponse {
    errCode: number,
    errMessage: string,
}

export interface SolutionItem {
    solutionId: string,
    solutionName: string,
    solutionVersion: string
}

export interface SolutionDetailItem extends SolutionItem {
    solutionMeta : {
        CompositeTypeMetas: Array<object>,
        BttMetas: Array<BehaviourTreeTaskNodeMeta>,
        BtdMetas: Array<object>,
        BtsMetas: Array<object>,
    }
}

//Meta
export interface BehaviourTreeTaskNodeMeta {
    BttType: string,
    Content: object
}

//End Meta

export interface AssetSetItem {
    assetSetId: string,
    solutionId: string,
    assetSetName: string
}

export interface AssetSummaryItem {
    assetId: string,
    assetSetId: string,
    assetType: string,
    assetName: string,
    assetVersion: string
}

export interface AssetDocument {
    assetId: string,
    assetSetId: string,
    assetType: string,
    assetName: string,
    assetContent: string,
    assetVersion: string
}

export interface BehaviourTreeModifiedNodeDiffInfo {
    modifiedNodeId: string
    preModifiedNode: ILogicBtNode | undefined,
    postModifiedNode: ILogicBtNode | undefined
}

export interface BehaviourTreeNodeModificationInfo {
    diffNodesInfos: Array<BehaviourTreeModifiedNodeDiffInfo>
    prevVersion: string,
    newVersion: string
}

export type ListSolutionResponse = ServerCommonResponse & { solutions: SolutionItem[] }
export type GetSolutionDetailResponse = ServerCommonResponse & { solutionDetail: SolutionDetailItem }
export type ListAssetSetsResponse = ServerCommonResponse & { assetSets: AssetSetItem[] }
export type ListAssetsResponse = ServerCommonResponse & { assetSummaryInfos: AssetSummaryItem[] }

export type ReadBehaviourTreeAssetResponse = ServerCommonResponse & { assetDocument: AssetDocument }
export type CreateBehaviourTreeNodeResponse = ServerCommonResponse & { modificationInfo: BehaviourTreeNodeModificationInfo }
export type MoveBehaviourTreeNodeResponse = ServerCommonResponse & { modificationInfo: BehaviourTreeNodeModificationInfo }
export type UpdateBehaviourTreeNodeResponse = ServerCommonResponse & { modificationInfo: BehaviourTreeNodeModificationInfo }
export type RemoveBehaviourTreeNodeResponse = ServerCommonResponse & { modificationInfo: BehaviourTreeNodeModificationInfo }
export type ConnectBehaviourTreeNodeResponse = ServerCommonResponse & { modificationInfo: BehaviourTreeNodeModificationInfo }

