import React from "react";
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import {ListAssetsAPI, ListAssetSetsAPI} from "../../common/ServerAPI";
import {AssetSetItem, AssetSummaryItem, ListAssetsResponse} from "../../common/ResponseDS";
import {AssetsTable} from "./AssetsTable";
import {IAssetSummaryForTab} from "../../common/BtDisplayDS";

export class AssetsExplorer extends React.Component< { solutionId: string, OnOpenDocument: (info: IAssetSummaryForTab) => void }, { assetSets: AssetSetItem[] , selectedAssetSet: string, assetSummaryInfos: (AssetSummaryItem & { id: string})[] }> {
    constructor(props: any) {
        super(props);
        this.state = { assetSets: [], selectedAssetSet: "", assetSummaryInfos: [] };
    }

    componentDidMount() {
        this.RequestListAssetSets().then(

        );
    }

    private _loadingAssetSetsListFlag : boolean = false;
    async RequestListAssetSets() {
        if(this._loadingAssetSetsListFlag)
        {
            return;
        }
        this._loadingAssetSetsListFlag = true;
        try {
            let res = await fetch(ListAssetSetsAPI,
                {
                    method: "POST",
                    body: JSON.stringify({ solutionId: this.props.solutionId })
                }
            );
            let resultData = await res.json();
            this.setState({assetSets: resultData.assetSets ?? []})

        }
        finally {
            this._loadingAssetSetsListFlag = false;
        }
    }

    private _loadingAssetsListFlag : boolean = false;
    private async DoRequestListAssets(reqAssetSetId: string) : Promise<ListAssetsResponse | null> {
        if(this._loadingAssetsListFlag)
        {
            return null;
        }
        this._loadingAssetSetsListFlag = true;
        let result : ListAssetsResponse | null = null;
        try {
            let res = await fetch(ListAssetsAPI,
                {
                    method: "POST",
                    body: JSON.stringify({ assetSetId: reqAssetSetId })
                }
            );
            result = await res.json();
        }
        catch(err) {
            throw err;
        }
        finally {
            this._loadingAssetsListFlag = false;
        }
        return result;
    }

    private GotoAssetSet(reqAssetSetId: string) {
        this.DoRequestListAssets(reqAssetSetId).then(
            (res) => {
                if(res !== null) {
                    this.setState({
                        selectedAssetSet: reqAssetSetId,
                        assetSummaryInfos: res.assetSummaryInfos?.map((item) => {
                            return { id: item.assetId, ...item }
                        }) ?? []
                    });
                }
            }
        );
    }


    render() {
        return (
            <div style={{ width: "60vw", height: "60vh", display: "flex" }}>
                <div style={{ padding: "20px", width: "20%"}}>
                    <div style={{width: "100%", display: "flex", alignItems: "center"}}>LOGO</div>
                    <div style={{background: "#ccc", height: "1px"}} />
                    <div>
                        <ToggleButtonGroup
                            fullWidth
                            orientation="vertical"
                            value={this.state.selectedAssetSet}
                            exclusive
                            onChange={(e, nextValue: string) => { if(nextValue) this.GotoAssetSet(nextValue) }}
                        >
                            {
                                this.state.assetSets.map((asset: AssetSetItem) =>
                                    <ToggleButton style={{ margin: "5px 0px"}} key={asset.assetSetId} value={asset.assetSetId} aria-label="list">
                                        {asset.assetSetName}
                                    </ToggleButton>
                            )}
                        </ToggleButtonGroup>
                    </div>
                </div>
                <div style={{background: "#ccc", width: "1px"}}/>
                <div style={{width:"80%"}}>
                    <AssetsTable AssetList={this.state.assetSummaryInfos} OnOpenDocument={this.props.OnOpenDocument}/>
                </div>
            </div>
        );
    }
}
