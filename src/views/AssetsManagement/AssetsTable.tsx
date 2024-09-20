import React, {useEffect, useRef, useState} from "react";
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridRowId,
    GridRowModes,
    GridToolbarContainer, ToolbarPropsOverrides
} from "@mui/x-data-grid";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import FileOpenIcon from '@mui/icons-material/FileOpen';
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {GridRowModesModel} from "@mui/x-data-grid/models/api/gridEditingApi";
import {AssetSummaryItem} from "../../common/ResponseDS";
import {IAssetSummaryForTab} from "../../common/BtDisplayDS";
import {Button, IconButton, TextField} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


export function AssetsTable(props: { AssetList: ({ id: string } & AssetSummaryItem)[], OnOpenDocument: (info: IAssetSummaryForTab) => void }) {
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const [isCreateMode, setIsCreateMode] = React.useState(false);

    const OnEdit = (id: GridRowId) => {
        setRowModesModel(previousState => {
            let resultModel : GridRowModesModel = {}
            for(let [k,m] of Object.entries(previousState))
            {
                if(k !== id && m.mode === GridRowModes.Edit) {
                    resultModel[k] = { mode: GridRowModes.View, ignoreModifications: true }
                }
            }
            resultModel[id] = { mode: GridRowModes.Edit }
            return resultModel
        });
        setIsCreateMode(false);
    }

    const OnSave = (id: GridRowId) => {
        setRowModesModel(previousState => {
            let resultModel : GridRowModesModel = {}
            for(let [k,m] of Object.entries(previousState))
            {
                if(k === id) {
                    resultModel[k] = { mode: GridRowModes.Edit }
                }
                else {
                    resultModel[k] = { mode: GridRowModes.View, ignoreModifications: false }
                }
            }
            return resultModel
        });
    }

    const OnDelete = (id: GridRowId) => {

    }

    const OnCancelEdit = (id: GridRowId) => {
        setRowModesModel(previousState => ({
            ...previousState,
            [id]: { mode: GridRowModes.View, ignoreModifications: true }
        }));
    }

    useEffect(() => {
        if(isCreateMode)
        {
            setRowModesModel(previousState => {
                let resultModel : GridRowModesModel = {}
                for(let [k,m] of Object.entries(previousState))
                {
                    if(m.mode === GridRowModes.Edit) {
                        resultModel[k] = { mode: GridRowModes.View, ignoreModifications: true }
                    }
                }
                return resultModel
            });
        }
    }, [isCreateMode]);

    const columns: GridColDef<(({ id: string } & AssetSummaryItem)[])[number]>[] = [
        {
            field: 'id',
            headerName: 'AssetId',
            type: 'string',
            width: 300,
            editable: false,
        },
        {
            field: 'assetType',
            headerName: 'AssetType',
            type: 'string',
            width: 150,
            editable: false,
        },
        {
            field: 'assetName',
            headerName: 'AssetName',
            type: 'string',
            width: 150,
            editable: true,
        },
        {
            field: 'assetVersion',
            headerName: 'AssetVersion',
            type: 'string',
            width: 300,
            editable: false,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 150,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={() => { OnSave(id) }}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={() => { OnCancelEdit(id) }}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<FileOpenIcon />}
                        label="Open"
                        className="textPrimary"
                        onClick={() => {
                            let selectedItem = props.AssetList.find(s => s.assetId === id)!;
                            if (selectedItem) {
                                props.OnOpenDocument({ assetId: selectedItem.id, assetName: selectedItem.assetName, assetType: selectedItem.assetType })
                            }
                        }}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={() => { OnEdit(id) }}
                        color="inherit"
                    />,
                    // <GridActionsCellItem
                    //     icon={<DeleteIcon />}
                    //     label="Delete"
                    //     onClick={() => {}}
                    //     color="inherit"
                    // />,
                ];
            },
        }
    ];

    const ToolbarProps: ToolbarPropsOverrides = {
        BeginCreateAsset() {
            setIsCreateMode(true)
        },

        OnCreateAsset(assetName: string, assetType: string) {
            console.log(`assetName : ${assetName}, assetType : ${assetType}`);
        },

        IsCreatingAsset: isCreateMode
    }

    return (
        <DataGrid
            slotProps={ {toolbar: ToolbarProps}}
            slots={ {toolbar: GridCustomToolbar} }
            rows={props.AssetList}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            initialState={{
                pagination: {
                    paginationModel: {
                        pageSize: 5,
                    },
                },
            }}
            pageSizeOptions={[5]}
            //checkboxSelection
            //disableRowSelectionOnClick
        />
    );
}

declare module '@mui/x-data-grid' {
    interface ToolbarPropsOverrides {
        BeginCreateAsset(): void
        OnCreateAsset(assetName: string, assetType: string): void

        IsCreatingAsset: boolean
    }
}

function GridCustomToolbar(props: ToolbarPropsOverrides) {
    const assetNameInputRef = useRef<HTMLInputElement>();

    useEffect(() => {
        if(props.IsCreatingAsset)
        {
            assetNameInputRef.current?.focus();
        }
    }, [props.IsCreatingAsset]);

    return (
        <GridToolbarContainer style={{ display:"flex", flexDirection:"row", alignItems:"center" }}>
            {
                props.IsCreatingAsset ?
                    <TextField
                        inputRef={assetNameInputRef}
                        style={{margin: "10px 5px"}}
                        label="New Solution Name"
                        id="standard-size-small"
                        size="small"
                        variant="standard"
                    /> : (null)
            }
            <IconButton onClick={() => props.BeginCreateAsset()}>
                <AddCircleOutlineIcon/>
            </IconButton>
        </GridToolbarContainer>
    );
}
