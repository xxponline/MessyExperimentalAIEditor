import React from "react";
import {EditorFrameworkView} from "../views/EditorFrameworkView";

// export interface IEditorFrameworkViewModelState {
//     NetState: NetStateEnum;
//     ErrorInfo: string | null;
// }

// export interface IEditorFrameworkRenderParameters {
//     netState: NetStateEnum,
//     netErrorInfo: string | null,
//     vmHelper: IEditorFrameworkHelper
// }

// export interface INetStateListener {
//     OnNetStateChange(state: NetStateEnum, errInfo : string | null): void;
// }
//
// export interface IEditorFrameworkHelper {
//     ConnectToProject(address : string): void
// }

export function BehaviourTreeEditorFramework()
{
    return (null)
}

// export class BehaviourTreeEditorFramework extends
//     React.Component<{}, IEditorFrameworkViewModelState>
//     implements INetStateListener, IEditorFrameworkHelper
// {
//     constructor(props:any) {
//         super(props);
//         this.state = {
//             NetState: NetStateEnum.StateOffline,
//             ErrorInfo: null
//         }
//     }
//
//     OnNetStateChange(netState: NetStateEnum, errInfo : string | null) {
//         //this.setState({NetState: netState, ErrorInfo: errInfo});
//     }
//
//     componentDidMount() {
//         //NetManager.Instance.Init();
//         //NetManager.Instance.RegisterNetStateListener(this);
//         //BehaviourTreeModel.Instance.Init();
//     }
//
//     componentWillUnmount() {
//         //NetManager.Instance.RemoveNetStateListener();
//     }
//
//     ConnectToProject(address: string): void {
//         //NetManager.Instance.ConnectToProject(address);
//     }
//
//     render() {
//         return (<EditorFrameworkView netState={NetStateEnum.StateConnected} netErrorInfo={this.state.ErrorInfo} vmHelper={this} />)
//     }
// }
