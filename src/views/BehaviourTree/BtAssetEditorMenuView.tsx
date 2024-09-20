import React from "react";
import "./BtAssetEditorMenu.css"
import {EditorPosition} from "../../common/EditorCommon";
import {BtNodeType} from "../../common/BtCommon";
import {SolutionDetailItem} from "../../common/ResponseDS";
import {IBtSettings, ILogicBtdData} from "../../common/BtLogicDS";

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

export interface IBtAssetEditorMenuHelper {
    CreateNode(type: BtNodeType, pos: EditorPosition, initialSettings: IBtSettings | null): void;

    RemoveNodes(): void;

    Disconnect(): void;
    //
    // LinkNode(source: string, target: string): void;
    //
    // Duplicate(nodeIds: string[]): void;
    //
    // Copy(nodeIds: string[]): void;
    //
    // Paste(pos: EditorPosition): void;
}

export interface IMenuPositions
{
    viewPosition: {
        x:number,
        y:number
    },
    screenPosition: {
        x: number,
        y:number
    }
}

export interface IBtAssetEditorEnumProps {
    contextMenu: EditorContextMenuEnum;
    dirMenu: MenuDirection;
    menuPositions: IMenuPositions

    editorHelper: IBtAssetEditorMenuHelper;

    solutionInfo: SolutionDetailItem;
}

export function BtAssetEditorMenuView(props: IBtAssetEditorEnumProps) {
    let localInfo : MenuLocalInfo = { left: props.menuPositions.viewPosition.x, top: props.menuPositions.viewPosition.y };
    let availableBttTypes = props.solutionInfo.solutionMeta.BttMetas?.map(m => m.BttType) ?? [];
    switch (props.contextMenu) {
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
                            props.editorHelper.CreateNode("bt_selector",
                                props.menuPositions.screenPosition, null
                            );
                        }}>Create Selector
                    </button>
                    <button onClick={
                        () => {
                            props.editorHelper.CreateNode("bt_sequence",
                                props.menuPositions.screenPosition, null
                            );
                        }}>Create Sequence
                    </button>
                    <button onClick={
                        () => {
                            props.editorHelper.CreateNode("bt_simpleParallel",
                                props.menuPositions.screenPosition, null
                            );
                        }}>Create SimpleParallel
                    </button>

                    {
                        Object.entries(availableBttTypes).map(([key, item]) =>
                            <button onClick={() => {
                                props.editorHelper.CreateNode("bt_task",
                                    props.menuPositions.screenPosition, { SubType: item }
                                );
                            }}>Create Task - {item}
                            </button>
                        )
                    }
                </div>
            );
        case EditorContextMenuEnum.Edge:
            return (
                <div
                    style={localInfo}
                    className="context-menu"
                >
                    <p style={{margin: '0.5em'}}>
                        <small>edge</small>
                    </p>
                    <button onClick={() => {props.editorHelper.Disconnect()}}>Disconnect</button>
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
                    <button onClick={()=>{props.editorHelper.RemoveNodes()}}>Delete</button>
                </div>
            );
        default:
            return (null);
    }
}
