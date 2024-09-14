import React, {useEffect, useState} from "react";
import {EnumEditorTerm} from "../CommonComponent/EnumEditableTerm";
import SettingsEditableTerm from "../CommonComponent/SettingsEditableTerm";
import {IMetaContentItem} from "../../common/BtCommon";
import {SolutionDetailItem} from "../../common/ResponseDS";
import {IBtSettings} from "../../common/BtLogicDS";

export interface IBtNodeInspectorHelper {
    UpdateBttType(currentTypeName: string): void;

    UpdateSettings(settingItermKey: string, settingValue: any): void;
}


export interface IBtNodeInspectorViewProps {
    SolutionDetailInfo : SolutionDetailItem;

    NodeType : string;
    InspectNodeId: string | null;
    DocVersion: string;

    ConfigurableData: IBtNodeConfigurableData | null

    Helper: IBtNodeInspectorHelper
}

export interface IBtNodeConfigurableData {
    Settings : IBtSettings,
    Descriptions : IBtSettings;
    Services: IBtSettings;
}

// BttViewInfo: {
//     ValidTypes: Array<string>;
//     CurrentType: string;
//     CurrentTypeMetaContent: IMetaContentItem;
//     SettingsContent: { [key: string] : any };
// } | null

export function BtNodeInspectorView(props: IBtNodeInspectorViewProps)
{
    if(props.NodeType === "bt_task") {
        return(<BtNodeInspectorViewForBtt {...props} />)
    } else {
        return(<BtNodeInspectorViewForOther {...props} />)
    }
}

function BtNodeInspectorViewForBtt(props: IBtNodeInspectorViewProps) {
    const solutionMeta = props.SolutionDetailInfo.solutionMeta;

    const [modifiedSubType, setModifiedSubType] = useState<string | null>(null)
    const [modifiedSettings, setModifiedSettings] = useState<IBtSettings>({});

    //Process Invalid Setting Value
    useEffect(() => {

    }, [modifiedSubType]);

    let ValidBttTypes = solutionMeta.BttMetas.map(m => m.BttType);
    const CurrentSettings = props.ConfigurableData!.Settings
    let subType = modifiedSubType ?? CurrentSettings.SubType;
    let MetaContentForSubType = solutionMeta.BttMetas.find(m => m.BttType === subType)!.Content

    return (
        <div style={{ padding: "5px",
            display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px"
        }}>
            <div>DocVersion: {props.DocVersion}</div>
            <div>NodeType: {props.NodeType}</div>
            <div>NodeId: {props.InspectNodeId}</div>
            <EnumEditorTerm label="TaskType" key="TaskTypeKey"
                            currentItem={subType}
                            optionalItems={ValidBttTypes}
                            onValueChange={(type) => {
                                setModifiedSettings(prevSettings => ({...prevSettings, SubType: type }))
                                //this.props.Helper.UpdateBttType(type)
                            }}
            />
            {
                Object.entries(MetaContentForSubType).map(([key, item]) =>
                    <SettingsEditableTerm key={key} settingsKey={key} meta={item} value={modifiedSettings[key] ?? CurrentSettings[key]}
                                          onValueChange={
                                              (value) => {
                                                  setModifiedSettings(prevSettings => ({...prevSettings,... {[key]: value } }))
                                              }
                                          }/>
                )
            }
        </div>
    );
}

function BtNodeInspectorViewForOther(props: IBtNodeInspectorViewProps) {
    return (
        <div style={{ padding: "5px",
            display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px"
        }}>
            <div>DocVersion: {props.DocVersion}</div>
            <div>NodeType: {props.NodeType}</div>
            <div>NodeId: {props.InspectNodeId}</div>
        </div>
    );
}
