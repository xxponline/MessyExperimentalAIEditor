import React from "react";
import {IEditorFrameworkRenderParameters} from "../viewmodels/EditorFrameworkViewModel";
import {NetStateEnum} from "../service/NetManager";
import {BtAssetExplorerViewModel} from "../viewmodels/BehaviourTree/BtAssetExplorerViewModel";
import {BtAssetEditorViewModel} from "../viewmodels/BehaviourTree/BtAssetEditorViewModel";
import {BtNodeInspectorViewModel} from "../viewmodels/BehaviourTree/BtNodeInspectorViewModel";

export class EditorFrameworkView extends React.Component<IEditorFrameworkRenderParameters, { } > {
    render() {
        let projectAddress = "localhost:8080";
        let renderResult : React.ReactNode = (null);
        switch (this.props.netState)
        {
            case NetStateEnum.StateOffline:
            case NetStateEnum.StateError:
                renderResult = (
                    <div>
                        <input type="text" value={projectAddress}
                               onChange={(ev) => {
                                   projectAddress = ev.target.value
                               }}
                        />
                        <div hidden={this.props.netState !== NetStateEnum.StateError}>Connection Error</div>
                        <button onClick={
                            () => { this.props.vmHelper.ConnectToProject(projectAddress) }}
                        >Connect</button>
                    </div>
                );
                break;
            case NetStateEnum.StateConnecting:
                renderResult = (
                    <div>
                        Connecting.....
                    </div>
                );
                break;
            case NetStateEnum.StateConnected:
                renderResult = (
                    <div style={{width: "100vw", height: "100vh"}}>
                        <div style={{width: "100%", height: "40px", backgroundColor: "#ccc"}}>
                        </div>
                        <div style={{width: "100%", height: "100%", display: "flex", flexDirection: "row"}}>
                            <div style={{width: "400px", height: "100%"}}>
                                <BtAssetExplorerViewModel/>
                            </div>
                            <div style={{width: "100%", height: "100%", backgroundColor: "green"}}>
                                <BtAssetEditorViewModel/>
                            </div>
                            <div style={{width: "500px", height: "100%"}}>
                                <BtNodeInspectorViewModel/>
                            </div>
                        </div>
                    </div>
                );
                break;
        }
        return renderResult;
    }
}
