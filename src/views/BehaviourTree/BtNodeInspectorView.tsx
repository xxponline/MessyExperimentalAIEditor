import React from "react";
import {IBtNodeInspectorViewProps} from "../../viewmodels/BehaviourTree/BtNodeInspectorViewModel";
import {EnumEditorTerm} from "../CommonComponent/EnumEditableTerm";
import SettingsEditableTerm from "../CommonComponent/SettingsEditableTerm";

export class BtNodeInspectorView extends React.Component<
    IBtNodeInspectorViewProps,
    {}> {

    constructor(props: IBtNodeInspectorViewProps) {
        super(props);
    }

    render() {
        if(this.props.NodeType === "bt_task") {
            let viewInfo = this.props.BttViewInfo!;
            return (
                <div style={{ padding: "5px",
                    display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px"
                }}>
                    <div>DocVersion: {this.props.DocVersion}</div>
                    <div>NodeType: {this.props.NodeType}</div>
                    <div>NodeId: {this.props.InspectNodeId}</div>
                    <EnumEditorTerm label="TaskType" key="TaskTypeKey"
                                    currentItem={viewInfo.CurrentType}
                                    optionalItems={viewInfo.ValidTypes}
                                    onValueChange={(type) => {
                                        this.props.Helper.UpdateBttType(type)
                                    }}
                    />
                    {
                        Object.entries(viewInfo.CurrentTypeMetaContent).map(([key, item]) =>
                            <SettingsEditableTerm key={key} settingsKey={key} meta={item} value={viewInfo.SettingsContent[key]}
                                                  onValueChange={(value) => this.props.Helper.UpdateSettings(key, value)}/>
                        )
                    }
                </div>
            );
        } else {
            return (
                <div style={{ padding: "5px",
                    display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px"
                }}>
                    <div>DocVersion: {this.props.DocVersion}</div>
                    <div>NodeType: {this.props.NodeType}</div>
                    <div>NodeId: {this.props.InspectNodeId}</div>
                </div>
            );
        }

    }
}

