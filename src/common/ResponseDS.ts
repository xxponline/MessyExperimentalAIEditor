import {ILogicBtNode} from "./BtLogicDS";
import {BttNodeMeta} from "./BtCommon";

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
        BttMetas: Array<BttNodeMeta>,
        BtdMetas: Array<object>,
        BtsMetas: Array<object>,
    }
}

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
export type CreateSolutionResponse = ServerCommonResponse & { newSolutionId: string, solutions: SolutionItem[] }

export type ListAssetSetsResponse = ServerCommonResponse & { assetSets: AssetSetItem[] | null }
export type CreateAssetSetResponse = ServerCommonResponse & { newAssetSetId: string, assetSets: AssetSetItem[] }

export type ListAssetsResponse = ServerCommonResponse & { assetSummaryInfos: AssetSummaryItem[] }
export type CreateAssetResponse = ServerCommonResponse & { newAssetId: string, assetSummaryInfos: AssetSummaryItem[] }

export type ReadBehaviourTreeAssetResponse = ServerCommonResponse & { assetDocument: AssetDocument }
export type CreateBehaviourTreeNodeResponse = ServerCommonResponse & { modificationInfo: BehaviourTreeNodeModificationInfo }
export type MoveBehaviourTreeNodeResponse = ServerCommonResponse & { modificationInfo: BehaviourTreeNodeModificationInfo }
export type UpdateBehaviourTreeNodeResponse = ServerCommonResponse & { modificationInfo: BehaviourTreeNodeModificationInfo }
export type RemoveBehaviourTreeNodeResponse = ServerCommonResponse & { modificationInfo: BehaviourTreeNodeModificationInfo }
export type ConnectBehaviourTreeNodeResponse = ServerCommonResponse & { modificationInfo: BehaviourTreeNodeModificationInfo }

export type GetDetailInfoAboutBehaviourTreeNodeResponse = ServerCommonResponse & { nodeInfo: ILogicBtNode }

