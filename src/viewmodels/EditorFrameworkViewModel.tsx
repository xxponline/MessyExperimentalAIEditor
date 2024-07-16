import React from "react";
import {NetManager, NetStateEnum} from "../service/NetManager";
import {EditorFrameworkView} from "../views/EditorFrameworkView";

export interface IEditorFrameworkViewModelState {
    NetState: NetStateEnum;
    ErrorInfo: string | null;
}

export interface IEditorFrameworkRenderParameters {
    netState: NetStateEnum,
    netErrorInfo: string | null,
    vmHelper: IEditorFrameworkHelper
}

export interface INetStateListener {
    OnNetStateChange(state: NetStateEnum, errInfo : string | null): void;
}

export interface IEditorFrameworkHelper {
    ConnectToProject(address : string): void
}

export class EditorFrameworkViewModel extends
    React.Component<{}, IEditorFrameworkViewModelState>
    implements INetStateListener, IEditorFrameworkHelper
{
    state: IEditorFrameworkViewModelState = {
        NetState: NetStateEnum.StateOffline,
        ErrorInfo: null
    }

    OnNetStateChange(netState: NetStateEnum, errInfo : string | null) {
        this.setState({NetState: netState, ErrorInfo: errInfo});
    }

    componentDidMount() {
        NetManager.Instance.Init();
        NetManager.Instance.RegisterNetStateListener(this);
    }

    componentWillUnmount() {
        NetManager.Instance.RemoveNetStateListener();
    }

    ConnectToProject(address: string): void {
        NetManager.Instance.ConnectToProject(address);
    }

    render() {
        return (<EditorFrameworkView netState={this.state.NetState} netErrorInfo={this.state.ErrorInfo} vmHelper={this} />)
    }
}
