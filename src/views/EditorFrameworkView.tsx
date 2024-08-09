import React from "react";
import {IEditorFrameworkRenderParameters} from "../viewmodels/BehaviourTreeEditorFramework";
import {NetStateEnum} from "../service/NetManager";
import {BtAssetExplorerViewModel} from "../viewmodels/BehaviourTree/BtAssetExplorerViewModel";
import {BtAssetEditorViewModel} from "../viewmodels/BehaviourTree/BtAssetEditorViewModel";
import {BtNodeInspectorViewModel} from "../viewmodels/BehaviourTree/BtNodeInspectorViewModel";
import {BtdInspectorViewModel} from "../viewmodels/BehaviourTree/BtdInspectorViewModel";
import {Button} from "@mui/material";
import {BehaviourTreeModel} from "../models/BehaviourTreeModel";

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
                        <div style={{width: "100%", height: "5vh", backgroundColor: "#ccc"}}>
                            <Button
                                onClick={() => {
                                    BehaviourTreeModel.Instance.RequestSaveCurrentBtDocumentation().
                                        then((ack)=> {console.log(ack)})
                                }}
                            >Save</Button>
                        </div>
                        <div style={{width: "100%", height: "92vh", display: "flex", flexDirection: "row"}}>
                            <div style={{width: "10%"}}>
                                <BtAssetExplorerViewModel/>
                            </div>
                            <div style={{width: "80%", backgroundColor: "green"}}>
                                <BtAssetEditorViewModel/>
                            </div>
                            <div style={{width: "10%"}}>
                                <BtNodeInspectorViewModel/>
                                <BtdInspectorViewModel/>
                            </div>
                        </div>
                    </div>
                );
                break;
        }
        return renderResult;
    }
}
