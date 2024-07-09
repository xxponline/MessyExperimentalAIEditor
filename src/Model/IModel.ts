export interface IModel {
    SendRequestMessage: (op: string, opDetail: any) => void;
    RegisterNotifyListener: () => void;
}
