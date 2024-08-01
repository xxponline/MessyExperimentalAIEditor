import React from "react";
import "./BtAssetEditorMenu.css"
import {IBtAssetEditorHelper} from "../../viewmodels/BehaviourTree/BtAssetEditorViewModel";
import {EditorPosition} from "../../common/EditorCommon";

export type MenuLocalInfo = { left?: number, right?: number, top?: number, bottom?: number }

export enum EditorContextMenuEnum {
    None,
    Pane,
    Node,
    Edge
}

export enum MenuDirection
{
    RightDown,
    LeftDown,
    RightUp,
    LeftUp
}

export interface IBtAssetEditorEnumProps {
    contextMenu: EditorContextMenuEnum;
    dirMenu: MenuDirection;
    position: EditorPosition;

    editorHelper: IBtAssetEditorHelper;
}

export class BtAssetEditorMenuView
    extends React.Component< IBtAssetEditorEnumProps, {} > {
    render() {
        let localInfo : MenuLocalInfo = { left: this.props.position.x, top: this.props.position.y };

        switch (this.props.contextMenu) {
            case EditorContextMenuEnum.None:
                return (null);
            case EditorContextMenuEnum.Pane:
                return (
                    <div style={ localInfo } className="context-menu">
                        <p style={{margin: '0.5em'}}>
                            <small>create new node</small>
                        </p>
                        <button onClick={
                            () => {
                                this.props.editorHelper.CreateNode("bt_selector",
                                    {x: this.props.position.x, y: this.props.position.y}
                                );
                        }}>Create Selector
                        </button>
                        <button onClick={
                            () => {
                                this.props.editorHelper.CreateNode("bt_sequence",
                                    {x: this.props.position.x, y: this.props.position.y}
                                );
                        }}>Create Sequence
                        </button>
                        <button onClick={
                            () => {
                                this.props.editorHelper.CreateNode("bt_simpleParallel",
                                    {x: this.props.position.x, y: this.props.position.y}
                                );
                        }}>Create SimpleParallel
                        </button>
                        <button onClick={() => {
                            this.props.editorHelper.CreateNode("bt_task",
                                {x: this.props.position.x, y: this.props.position.y}
                            );
                        }}>Create Task
                        </button>
                    </div>
                );
            case EditorContextMenuEnum.Edge:
                return (
                    <div
                        style={ localInfo }
                        className="context-menu"
                    >
                        <p style={{margin: '0.5em'}}>
                            <small>edge: 1111</small>
                        </p>
                        <button onClick={() => {}}>delete</button>
                    </div>
                );
            case EditorContextMenuEnum.Node:
                return (
                    <div
                        style={ localInfo }
                        className="context-menu"
                    >
                        <p style={{margin: '0.5em'}}>
                            {/*<small>node: {this.props.toolUtils.SelectedNodes![0].id}</small>*/}
                        </p>
                        {/*<button onClick={ () => { this.props.editorHelper.RemoveNode() } }>duplicate</button>*/}
                        <button onClick={()=>{}}>delete</button>
                    </div>
                );
            default:
                return (null);
        }
    }
}
