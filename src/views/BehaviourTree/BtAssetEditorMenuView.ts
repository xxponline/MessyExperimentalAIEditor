export type MenuLocalInfo = { x: number, y: number, left?: number, right?: number, top?: number, bottom?: number }

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
