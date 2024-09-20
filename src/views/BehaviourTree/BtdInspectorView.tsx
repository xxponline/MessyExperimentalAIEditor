import React from "react";
import ReactDragListView from "react-drag-listview"
import CollapsibleSection from "../CommonComponent/CollapsibleSection";
import SettingsEditableTerm from "../CommonComponent/SettingsEditableTerm";
import {Button, IconButton, Menu, MenuItem} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {IBtdDisplayNode} from "../../common/BtDisplayDS";
import {BtdNodeMeta} from "../../common/BtCommon";

export interface IBtdInspectorViewProps {
    InspectNodeId: string | null;
    BtdMetas: BtdNodeMeta[];
    AttachedBTDs: IBtdDisplayNode[];

    Helper: IBtdInspectorHelper
}

export interface IBtdInspectorHelper {
    UpdateBtdSettings(btdId: string, settingItermKey: string, settingValue: any): void;
    OnMoveItem(fromIdx: number, toIdx: number): void;
    CreateBtdNode(btdType: string): void;
    RemoveBtdNode(btdNodeId: string): void;
}

export default class BtdInspectorView extends React.Component<IBtdInspectorViewProps, { anchorEl: HTMLElement | null }>
{
    constructor(props: IBtdInspectorViewProps) {
        super(props);
        this.state = {
            anchorEl: null
        }
    }


    // private handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    //     setAnchorEl(event.currentTarget);
    // }

    private OpenCreateMenu(event: React.MouseEvent<HTMLButtonElement>)
    {
        this.setState({anchorEl: event.currentTarget});
    }

    private CloseCreateMenu()
    {
        this.setState({anchorEl: null});
    }

    render() {
        return (
            <div style={{width: "90%"}}>
                <CollapsibleSection title="BT Descriptors">
                    <ReactDragListView
                        onDragEnd={(from, to) => this.props.Helper.OnMoveItem(from, to)}
                        nodeSelector='.DraggableItem'
                        handleSelector='.DraggableTitle'
                    >
                        <div style={{display: "flex", flexDirection: "column", gap: "2px"}}>
                            {this.props.AttachedBTDs.map((btdItem, index) => this.RenderBtdItem(btdItem, index))}
                        </div>
                    </ReactDragListView>
                    {
                        this.RenderBtdCreateButton()
                    }
                </CollapsibleSection>
            </div>
        );
    }

    RenderBtdItem(btdItem: IBtdDisplayNode, index: number): React.ReactNode {
        let BtdTypeMeta = this.props.BtdMetas.find(m => m.BtdType === btdItem.BtdType);
        if (BtdTypeMeta) {
            return (
                <div key={index} className="DraggableItem" style={{padding: "10px", border: "1px solid black"}}>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <div className="DraggableTitle">{btdItem.BtdType} [{btdItem.Order}]</div>
                        <IconButton aria-label="delete" size="small" onClick={() => {this.props.Helper.RemoveBtdNode(btdItem.id)}}>
                            <Delete style={{ color: "red" }} fontSize="small"/>
                        </IconButton>
                    </div>
                    {
                        Object.entries(BtdTypeMeta.Content).map(([key, metaItem]) =>
                            <SettingsEditableTerm key={key} settingsLabel={key} meta={metaItem} value={btdItem[key]}
                                                  onValueChange={(value) => {
                                                      this.props.Helper.UpdateBtdSettings(btdItem.id, key, value)
                                                  }}/>
                        )
                    }
                </div>
            );
        } else {
            return (
                <div key={index} className="DraggableItem" style={{padding: "10px", border: "1px solid black"}}>
                    <div className="DraggableTitle" style={{color: "red"}}>{btdItem.BtdType}</div>
                </div>
            );
        }
    }

    RenderBtdCreateButton(): React.ReactNode {
        if (this.props.BtdMetas.length > 0) {
            return (
                <div>
                    <Button
                        id="basic-button"
                        aria-controls={Boolean(this.state.anchorEl) ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={Boolean(this.state.anchorEl) ? 'true' : undefined}
                        onClick={(e) => this.OpenCreateMenu(e)}
                    >
                        CreateDescriptor
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={this.state.anchorEl}
                        open={Boolean(this.state.anchorEl)}
                        onClose={() => {
                            this.CloseCreateMenu()
                        }}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        {
                            this.props.BtdMetas.map((m) => {
                                return (
                                    <MenuItem
                                        key={`create_${m.BtdType}`}
                                        onClick={() => {
                                            this.CloseCreateMenu();
                                            this.props.Helper.CreateBtdNode(m.BtdType);
                                        }}
                                    >{m.BtdType}</MenuItem>
                                )
                            })
                        }
                    </Menu>
                </div>
            )
        } else {
            return (null);
        }
    }

}
