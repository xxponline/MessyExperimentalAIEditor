import React, {useEffect} from "react";
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import {ListAssetsAPI, ListAssetSetsAPI} from "../../common/ServerAPI";
import {AssetSetItem, AssetSummaryItem, ListAssetSetsResponse, ListAssetsResponse} from "../../common/ResponseDS";
import {AssetsTable} from "./AssetsTable";
import {IAssetSummaryForTab} from "../../common/BtDisplayDS";

export function AssetsExplorer(props: { solutionId: string, OnOpenDocument: (info: IAssetSummaryForTab) => void })
{
    const [assetSets, setAssetSets] = React.useState<AssetSetItem[]>([]);
    const [selectedAssetSetId, setSelectedAssetSetId] = React.useState<string>("");
    const [assetSummaryInfos, setAssetSummaryInfos] = React.useState<(AssetSummaryItem & { id: string})[]>([])

    useEffect(() => {
        fetch(ListAssetSetsAPI,
            {
                method: "POST",
                body: JSON.stringify({ solutionId: props.solutionId })
            }
        ).then(
            (res) => res.json()
        ).then(
            (resultData : ListAssetSetsResponse) =>{
                if(resultData.errCode == 0){
                    setAssetSets(resultData.assetSets);
                    if(resultData.assetSets.length > 0) {
                        setSelectedAssetSetId(resultData.assetSets[0].assetSetId);
                    }
                }
            }
        )
    }, []);

    useEffect(() => {
        if (selectedAssetSetId.length > 0) {
            fetch(ListAssetsAPI,
                {
                    method: "POST",
                    body: JSON.stringify({ assetSetId: selectedAssetSetId })
                }
            ).then(
                (res) => res.json()
            ).then(
                (result: ListAssetsResponse) => {
                    if(result.errCode === 0) {
                        setAssetSummaryInfos(result.assetSummaryInfos?.map((item) => {
                            return { id: item.assetId, ...item }
                        }) ?? [])
                    }
                }
            )
        }
    }, [selectedAssetSetId]);

    return (
        <div style={{ width: "60vw", height: "60vh", display: "flex" }}>
            <div style={{ padding: "20px", width: "20%"}}>
                <div style={{width: "100%", display: "flex", alignItems: "center"}}>LOGO</div>
                <div style={{background: "#ccc", height: "1px"}} />
                <div>
                    <ToggleButtonGroup
                        fullWidth
                        orientation="vertical"
                        value={selectedAssetSetId}
                        exclusive
                        onChange={(e, nextValue: string) => { if(nextValue) setSelectedAssetSetId(nextValue) }}
                    >
                        {
                            assetSets.map((asset: AssetSetItem) =>
                                <ToggleButton style={{ margin: "5px 0px"}} key={asset.assetSetId} value={asset.assetSetId} aria-label="list">
                                    {asset.assetSetName}
                                </ToggleButton>
                            )}
                    </ToggleButtonGroup>
                </div>
            </div>
            <div style={{background: "#ccc", width: "1px"}}/>
            <div style={{width:"80%"}}>
                <AssetsTable AssetList={assetSummaryInfos} OnOpenDocument={props.OnOpenDocument}/>
            </div>
        </div>
    );
}
