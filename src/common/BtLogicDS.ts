import {BtNodeType} from "../common/BtCommon";

export interface IBtSettings {
    [key: string]: any
}

export interface ILogicBtNode {
    id: string,
    order: number,
    parentId: string,
    position: { x: number, y: number },
    type: BtNodeType,
    data: IBtSettings | null
}

export interface ILogicBtDescriptor {
    id: string,
    attachTo: string,
    data: IBtSettings;
}

export interface ILogicBtService {
    id: string,
    attachTo: string,
    data: IBtSettings
}

export interface ILogicBtConnection {
    id: string,
    source: string,
    target: string,
}

export interface IBtAssetDocument {
    ModifyTimeStamp: number;
    Nodes: Array<ILogicBtNode>;
    Connections: Array<ILogicBtConnection>;
    Services: Array<ILogicBtService>;
    Descriptors: Array<ILogicBtDescriptor>;
}

//Need To Removed
export type IBtcNodeData = any
export type IBttNodeData = any
export type ILogicBtdData = any
export type ILogicBtsData = any
