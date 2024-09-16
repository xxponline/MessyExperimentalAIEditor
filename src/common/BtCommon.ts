export type BtNodeType = ("bt_root" | "bt_selector" | "bt_sequence" | "bt_simpleParallel" | "bt_task");

export interface IMetaContentItem  {
    type: string,
    default: any,
    optionalItems?: any[]
}

interface IConfigurableNodeMeta {
    Content: {
        [key: string]: {
            type: string,
            default: any,
            optionalItems?: any[]
        }
    }
}

export type BttNodeMeta = IConfigurableNodeMeta & { BttType: string }
export type BtdNodeMeta = IConfigurableNodeMeta & { BtdType: string }
export type BtsNodeMeta = IConfigurableNodeMeta & { BtsType: string }
