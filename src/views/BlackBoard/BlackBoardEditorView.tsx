import React from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {DataGrid, GridActionsCellItem, GridColDef, GridRowId, GridRowModes} from '@mui/x-data-grid';
import {GridRowModesModel} from "@mui/x-data-grid/models/api/gridEditingApi";

export class BlackBoardEditorView extends React.Component<any, { rowModesModel: GridRowModesModel}> {
    constructor(props: any) {
        super(props);
        this.state = {
            rowModesModel: {}
        }
    }
    private rows = [
        { id: 'key1', bbKey: 'bbkey1', bbType: 'int'},
        { id: 'key2', bbKey: 'bbkey2', bbType: 'string'}
    ];

    private columns: GridColDef<(typeof this.rows)[number]>[] = [
        {
            field: 'bbKey',
            headerName: 'bbKey',
            type: 'string',
            width: 150,
            editable: true,
        },
        {
            field: 'bbType',
            headerName: 'bbType',
            type: 'singleSelect',
            valueOptions: ['int', 'string', 'float'],
            width: 110,
            editable: true,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
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


    render() {
        return (
            <DataGrid
                rows={this.rows}
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
