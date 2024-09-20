import React, {useEffect, useRef} from "react";
import {IconButton, TextField, ToggleButton, ToggleButtonGroup} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {CreateAssetSetAPI, ListAssetsAPI, ListAssetSetsAPI} from "../../common/ServerAPI";
import {
    AssetSetItem,
    AssetSummaryItem,
    CreateAssetSetResponse,
    ListAssetSetsResponse,
    ListAssetsResponse
} from "../../common/ResponseDS";
import {AssetsTable} from "./AssetsTable";
import {IAssetSummaryForTab} from "../../common/BtDisplayDS";

export function AssetsExplorer(props: { solutionId: string, OnOpenDocument: (info: IAssetSummaryForTab) => void })
{
    const [assetSets, setAssetSets] = React.useState<AssetSetItem[]>([]);
    const [selectedAssetSetId, setSelectedAssetSetId] = React.useState<string>("");

    const createAssetSetTogKey = "CreateNewAssetSet";

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
                if(resultData.errCode === 0){
                    setAssetSets(resultData.assetSets?? []);
                    if(resultData.assetSets?.length?? 0 > 0) {
                        setSelectedAssetSetId(resultData.assetSets![0].assetSetId);
                    }
                }
            }
        )
    }, []);

    useEffect(() => {
        if(selectedAssetSetId === createAssetSetTogKey){
            newAssetSetNameRef.current?.focus();
        }
    }, [selectedAssetSetId]);

    const newAssetSetNameRef = useRef<HTMLInputElement>();
    const handleCreateAssetSetClick = () => {
        if(selectedAssetSetId === createAssetSetTogKey){
            if(newAssetSetNameRef.current!.value.length > 0)
            {
                fetch(CreateAssetSetAPI, {
                    method: "POST",
                    body: JSON.stringify({ solutionId: props.solutionId, assetSetName: newAssetSetNameRef.current!.value })
                }).then(
                    (res) => res.json()
                ).then(
                    (result: CreateAssetSetResponse) => {
                        if(result.errCode === 0) {
                            setAssetSets(result.assetSets);
                            setSelectedAssetSetId(result.newAssetSetId);
                        }
                    }
                )
            }
        }
        else {
            setSelectedAssetSetId(createAssetSetTogKey);
        }
    }

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
                            )
                        }

                        {
                            <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                <TextField
                                    fullWidth={selectedAssetSetId === createAssetSetTogKey}
                                    type={selectedAssetSetId === createAssetSetTogKey ? "text" : "hidden"}
                                    inputRef={newAssetSetNameRef}
                                    style={{margin: "10px 5px"}}
                                    label="Set Name"
                                    id="standard-size-small"
                                    size="small"
                                    variant="standard"
                                />
                                <IconButton aria-label="add" onClick={handleCreateAssetSetClick}>
                                    <AddCircleOutlineIcon/>
                                </IconButton>
                            </div>
                        }

                    </ToggleButtonGroup>
                </div>
            </div>
            <div style={{background: "#ccc", width: "1px"}}/>
            <div style={{width: "80%"}}>
                <AssetsTable assetSetId={selectedAssetSetId} OnOpenDocument={props.OnOpenDocument}/>
            </div>
        </div>
    );
}
