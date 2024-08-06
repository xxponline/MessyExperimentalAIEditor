import {BtAssetDetail, BtAssetSummary} from "../models/BtLogicDataStructure";
import {BttNodeMeta} from "../common/BtCommon";

export type NetMsgType = 'req' | 'ack' | 'ntf';

export enum AckMessageCode {
    SUCCESS = 0,
}

export class BaseNetMessage {
    msgType!: NetMsgType;
}

export class ReqNetMessage extends BaseNetMessage {
    msgType: 'req' = 'req';
    reqId!: string;
    reqOperation!: string
    reqOpContent!: any
}

export class AckNetMessage extends BaseNetMessage {
    msgType: 'ack' = 'ack'
    reqId!: string;
    ackCode: AckMessageCode = AckMessageCode.SUCCESS;
    errInfo?: string;
}

export class NtfNetMessage extends BaseNetMessage {
    msgType: 'ntf' = 'ntf';
    ntfOperation!: string;
    ntfOpContent!: any;
}

export class ListBtAssetsNtfMessage extends NtfNetMessage {
    msgType: 'ntf' = 'ntf';
    ntfOperation!: string;
    ntfOpContent!: BtAssetSummary[];
}

export class ReadBtAssetNtfMessage extends NtfNetMessage {
    msgType: 'ntf' = 'ntf';
    ntfOperation!: string;
    ntfOpContent!: BtAssetDetail
}

export class BttNodeMetaNtfMessage extends NtfNetMessage {
    msgType: 'ntf' = 'ntf';
    ntfOperation!: string;
    ntfOpContent!: BttNodeMeta[]
}
