import React from "react";
import {DataGrid, GridActionsCellItem, GridColDef, GridRowId, GridRowModes} from "@mui/x-data-grid";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import FileOpenIcon from '@mui/icons-material/FileOpen';
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {GridRowModesModel} from "@mui/x-data-grid/models/api/gridEditingApi";
import {AssetSummaryItem} from "../../common/ResponseDS";
import {IAssetSummaryForTab} from "../../common/BtDisplayDS";

export class AssetsTable extends React.Component<
    { AssetList: ({ id: string } & AssetSummaryItem)[], OnOpenDocument: (info: IAssetSummaryForTab) => void },
    { rowModesModel: GridRowModesModel }>
{
    constructor(props:any) {
        super(props);
        this.state = { rowModesModel: {} }
    }

    private OnEdit(id: GridRowId)
    {
        this.setState(previousState => ({
            rowModesModel : {
                ... previousState.rowModesModel,
                [id]: { mode: GridRowModes.Edit, ignoreModifications: false },
            }
        }));
    }

    private OnSave(id: GridRowId){
        this.setState(previousState => ({
            rowModesModel : {
                ... previousState.rowModesModel,
                [id]: { mode: GridRowModes.View, ignoreModifications: false },
            }
        }));
    }

    private OnDelete(id: GridRowId){

    }

    private OnCancelEdit(id: GridRowId){
        this.setState(previousState => ({
            rowModesModel : {
                ... previousState.rowModesModel,
                [id]: { mode: GridRowModes.View, ignoreModifications: true },
            }
        }));
    }


    private columns: GridColDef<(({ id: string } & AssetSummaryItem)[])[number]>[] = [
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
                const isInEditMode = this.state.rowModesModel[id]?.mode === GridRowModes.Edit;
                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: 'primary.main',
                            }}
                            onClick={() => { this.OnSave(id) }}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={() => { this.OnCancelEdit(id) }}
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
                            let selectedItem = this.props.AssetList.find(s => s.assetId === id)!;
                            if (selectedItem) {
                                this.props.OnOpenDocument({ assetId: selectedItem.id, assetName: selectedItem.assetName, assetType: selectedItem.assetType })
                            }
                        }}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={() => { this.OnEdit(id) }}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={() => {}}
                        color="inherit"
                    />,
                ];
            },
        }
    ];

    render() {
        return (
            <DataGrid
                rows={this.props.AssetList}
                columns={this.columns}
                editMode="row"
                rowModesModel={this.state.rowModesModel}
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
}
