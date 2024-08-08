export type BtNodeType = ("bt_root" | "bt_selector" | "bt_sequence" | "bt_simpleParallel" | "bt_task");

export interface IMetaContentItem {
    [key: string]: {
        type: string,
        default: any,
        OptionalItems?: any[]
    }
}

interface IConfigurableNodeMeta {
    Content: IMetaContentItem
}

export type BttNodeMeta = IConfigurableNodeMeta & { BttType: string }
export type BtdNodeMeta = IConfigurableNodeMeta & { BtdType: string }
export type BtsNodeMeta = IConfigurableNodeMeta & { BtsType: string }
