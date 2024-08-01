import React from "react";
import {IBtNodeInspectorViewProps} from "../../viewmodels/BehaviourTree/BtNodeInspectorViewModel";
import {BooleanEditableTerm} from "../AttributeEditableTerm/BooleanEditableTerm";
import {EnumEditorTerm} from "../AttributeEditableTerm/EnumEditableTerm";
import {StringEditableTerm} from "../AttributeEditableTerm/StringEditableTerm";
import {IntEditableTerm} from "../AttributeEditableTerm/IntEditableTerm";
import {FloatEditableTerm} from "../AttributeEditableTerm/FloatEditableTerm";
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";

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
                <div style={{
                    width: "100%", height: "100%",
                    backgroundColor: "#ffffffe0", top: "50px", right: "100px", zIndex: 5, padding: "10px",
                    display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px"
                }}>
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
                        Object.entries(viewInfo.SettingTerms).map(([key, item]) =>
                            this.RenderContentItem(key, item, viewInfo.SettingContent[key])
                        )
                    }
                </div>
            );
        } else {
            return (
                <div style={{
                    width: "100%", height: "100%",
                    backgroundColor: "#ffffffe0", top: "50px", right: "100px", zIndex: 5, padding: "10px",
                    display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px"
                }}>
                    <div>NodeType: {this.props.NodeType}</div>
                    <div>NodeId: {this.props.InspectNodeId}</div>
                </div>
            );
        }

    }

    private RenderContentItem(key: string, meta: any, value: any) : React.ReactNode {
        switch (meta.type) {
            case "String":
                return (
                    <StringEditableTerm
                        key={generateUniqueID()}
                        label={key} value={value}
                        onValueChange={(value) => { this.props.Helper.UpdateSettings(key, value) }}
                    />
                );
            case "Int":
                return (
                    <IntEditableTerm
                        key={generateUniqueID()}
                        value={value} label={key}
                        onValueChange={(value) => { this.props.Helper.UpdateSettings(key, value) }}
                    />
                );
            case "Float":
                return (
                    <FloatEditableTerm
                        key={generateUniqueID()}
                        value={value} label={key}
                        onValueChange={(value) => { this.props.Helper.UpdateSettings(key, value) }}
                    />
                );
            case "Enum":
               return (
                   <EnumEditorTerm
                       key={generateUniqueID()}
                       label={key}
                       currentItem={value}
                       optionalItems={meta.OptionalItems}
                       onValueChange={(v) => this.props.Helper.UpdateSettings(key, v)}
                   />
               );
            case "Boolean":
                return (
                    <BooleanEditableTerm
                        key={generateUniqueID()}
                        label={key} value={value}
                        onValueChange={(v) => this.props.Helper.UpdateSettings(key, v)}
                    />
                );
            // case "BBKey":
            //     return (
            //         <div>
            //             <label>{key}:</label>
            //             <input type="text"></input>
            //         </div>
            //     );
        }
    }
}

