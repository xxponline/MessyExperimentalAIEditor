import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";
import {AckNetMessage, BaseNetMessage, NtfNetMessage, ReqNetMessage} from "../common/NetMessage";
import {INetStateListener} from "../viewmodels/BehaviourTreeEditorFramework";
import {BehaviourTreeModel} from "../models/BehaviourTreeModel";

export enum NetStateEnum {
    StateOffline,
    StateConnecting,
    StateConnected,
    StateError
}

export class NetManager{
    private static _instance : NetManager | null = null;
    private constructor() {
    }


    public static get Instance() : NetManager
    {
        if(this._instance === null)
        {
            this._instance = new NetManager();
        }
        return this._instance;
    }

    private _socket : WebSocket | null = null;

    private _ackWaitMap: Map<string, {
        ttl: number
        resolve: (msg: AckNetMessage) => void,
        reject: (err: Error) => void
    }> = new Map();

    private _ntfListenerMap: Map<string, (ntfMsg: NtfNetMessage) => void> = new Map();

    public Init()
    {
        if(!this.IsInit)
        {
            this._isInitialized = true;
            this._ackWaitMap.clear();
            this._ntfListenerMap.clear();
        }
    }

    private _isInitialized : boolean = false;

    public get IsInit() : boolean
    {
        return this._isInitialized;
    }

    public async SendRequestMessage(op: string, reqContent: { }, timeout = 10000) : Promise<AckNetMessage>
    {
        let reqId = generateUniqueID();
        let msg :ReqNetMessage = {
            msgType: "req",
            reqId: reqId,
            reqOperation: op,
            reqOpContent: reqContent
        }

        //add to the wait list
        let waiter : Promise<AckNetMessage> = new Promise((resolve, reject)=>{
            if(this._ackWaitMap.has(reqId)) {
                throw new Error(`Accident Duplicated Msg Id ${reqId}`);
            }
            this._ackWaitMap.set(reqId, { ttl: timeout, resolve, reject});
        });
        // real send msg
        this._socket!.send(JSON.stringify(msg));

        return waiter;
    }

    private _netState : NetStateEnum = NetStateEnum.StateOffline;
    public get NetState() : NetStateEnum {
        return this._netState;
    }

    private _netStateListener : INetStateListener | null = null;
    public RegisterNetStateListener(listener : INetStateListener) {
        this._netStateListener = listener;
    }
    public RemoveNetStateListener() {
        this._netStateListener = null;
    }

    public ConnectToProject(address: string) {
        this._netState = NetStateEnum.StateConnecting;

        this._socket = new WebSocket(`ws://${address}/FrontendAPI/WSInterface`);
        this._socket.onopen = (ev) => { NetManager.Instance.OnWSOpen(ev) };
        this._socket.onmessage = (ev) => { NetManager.Instance.OnWSMessage(ev) };
        this._socket.onclose = (ev) => { NetManager.Instance.OnWSClose(ev) };
        this._socket.onerror = (ev) => { NetManager.Instance.OnWSError(ev) };
    }

    private OnWSMessage(ev: MessageEvent)
    {
        let msg : BaseNetMessage = JSON.parse(ev.data);
        switch (msg.msgType) {
            case 'ack': {
                let ackMsg = msg as AckNetMessage;
                let reqId = ackMsg.reqId;
                if (this._ackWaitMap.has(reqId)) {
                    this._ackWaitMap.get(reqId)?.resolve(ackMsg);
                    this._ackWaitMap.delete(reqId);
                }
            }
                break;
            case 'ntf': {
                let ntfMsg = msg as NtfNetMessage;
                let ntfOp = ntfMsg.ntfOperation;
                let listenerFunc = this._ntfListenerMap.get(ntfOp);
                if(listenerFunc){
                    listenerFunc(ntfMsg);
                }
            }
                break;
            default:
                throw new Error(msg.msgType);
        }
    }

    private OnWSOpen(ev: Event) {
        BehaviourTreeModel.Instance.RequestBehaviourTreesBttNodeMetas().then((msg) => {
            this._netState = NetStateEnum.StateConnected;
            this._netStateListener?.OnNetStateChange(this.NetState, null);
        });
    }

    private OnWSClose(ev: CloseEvent) {
        this._netState = NetStateEnum.StateOffline;
        this._netStateListener?.OnNetStateChange(this.NetState, null);
    }

    private OnWSError(ev: Event) {
        this._netState = NetStateEnum.StateError;
        this._netStateListener?.OnNetStateChange(this.NetState, ev.type);

    }

    public RegisterNtfListener(op: string, listener: (NtfMsg: NtfNetMessage) => void)
    {
        if(!this._ntfListenerMap.has(op)) {
            this._ntfListenerMap.set(op, listener);
        }
        else {
            throw new Error(`Accident Duplicated ${op}`);
        }
    }
}
