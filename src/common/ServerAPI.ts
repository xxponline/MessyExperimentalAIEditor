const ServerUrl : string = "http://localhost:8000";

export const ListSolutionsAPI: string = `${ServerUrl}/AssetManagement/ListSolutions`;
export const CreateSolutionAPI: string = `${ServerUrl}/AssetManagement/CreateSolution`;

export const ListAssetSetsAPI: string = `${ServerUrl}/AssetManagement/ListAssetSets`;
export const CreateAssetSetAPI: string = `${ServerUrl}/AssetManagement/CreateAssetSet`;

export const ListAssetsAPI: string =  `${ServerUrl}/AssetManagement/ListAssets`;
export const ReadAssetAPI: string = `${ServerUrl}/AssetManagement/ReadAsset`;

export const CreateBehaviourTreeNodeAPI: string = `${ServerUrl}/AssetContentModifier/CreateBehaviourTreeNode`;
export const RemoveBehaviourTreeNodeAPI: string = `${ServerUrl}/AssetContentModifier/RemoveBehaviourTreeNode`;
export const MoveBehaviourTreeNodeAPI: string = `${ServerUrl}/AssetContentModifier/MoveBehaviourTreeNode`;
export const UpdateBehaviourTreeNodeAPI = `${ServerUrl}/AssetContentModifier/UpdateBehaviourTreeNode`;
