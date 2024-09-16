import React, {useEffect, useState} from "react";
import {EnumEditorTerm} from "../CommonComponent/EnumEditableTerm";
import SettingsEditableTerm from "../CommonComponent/SettingsEditableTerm";
import {IMetaContentItem} from "../../common/BtCommon";
import {
    BehaviourTreeNodeModificationInfo,
    GetDetailInfoAboutBehaviourTreeNodeResponse,
    SolutionDetailItem, UpdateBehaviourTreeNodeResponse
} from "../../common/ResponseDS";
import {IBtSettings} from "../../common/BtLogicDS";
import {GetDetailInfoAboutBehaviourTreeNodeAPI, UpdateBehaviourTreeNodeAPI} from "../../common/ServerAPI";
import {Button} from "@mui/material";
import RevertIcon from '@mui/icons-material/History';
import SendIcon from "@mui/icons-material/Send";

export interface IBtNodeInspectorHelper {
    OnUpdatedBehaviourTreeNodeSettings(modifiedInfo : BehaviourTreeNodeModificationInfo) : void;
}


export interface IBtNodeInspectorViewProps {
    SolutionDetailInfo : SolutionDetailItem;

    AssetId: string;
    NodeType : string;
    InspectNodeId: string | null;
    DocVersion: string;

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

interface BttConfigurableSettingsItem {
    meta: IMetaContentItem,
    currentValue: any,
    persistentValue: any,
    ableToRevert: boolean
}

interface BttConfigurableSubType {
    currentValue: string,
    persistentValue: string
}

function BtNodeInspectorViewForBtt(props: IBtNodeInspectorViewProps) {
    const solutionMeta = props.SolutionDetailInfo.solutionMeta;

    const [persistentSettings, setPersistentSettings] = React.useState<IBtSettings>({})
    const [interimSettings, setInterimSettings] = useState<{ [key: string]: BttConfigurableSettingsItem }>({});
    const [interimSubType, setInterimSubType] = useState<BttConfigurableSubType | null>(null);
    const [displaySettingKeys, setDisplaySettings] = useState<string[]>([]);

    let ValidBttTypes = solutionMeta.BttMetas.map(m => m.BttType);

    useEffect(() => {
        fetch(GetDetailInfoAboutBehaviourTreeNodeAPI, {
            method: 'POST',
            body: JSON.stringify(
                {
                    assetId: props.AssetId,
                    nodeId: props.InspectNodeId,
                }
            )
        }).then(
            res => res.json()
        ).then(
            (res: GetDetailInfoAboutBehaviourTreeNodeResponse) => {
                console.log(res)
                if(res.errCode === 0) {
                    setPersistentSettings(res.nodeInfo.settings!)
                }
            }
        )

    }, [props.InspectNodeId]);

    useEffect(() => {
        console.log(persistentSettings)
        if(Object.keys(persistentSettings).length > 0) {
            setInterimSubType({ currentValue: persistentSettings.SubType, persistentValue: persistentSettings.SubType });
            setInterimSettings({});
            setDisplaySettings([]);
        }
    }, [persistentSettings]);

    useEffect(() => {
        console.log(interimSubType);
        if(interimSubType !== null)
        {
            let bttMetaContent = solutionMeta.BttMetas.find(m => m.BttType === interimSubType.currentValue)?.Content ?? {}

            //Add Additional Settings Item For This Btt Type And Hide Settings Outside It
            let additionalSettings: { [key: string]: BttConfigurableSettingsItem } = {}
            for(let [k,m] of Object.entries(bttMetaContent)) {
                if(interimSettings[k] === undefined)
                {
                    additionalSettings[k] = {
                        meta: m,
                        currentValue: persistentSettings[k] ?? m.default,
                        persistentValue: persistentSettings[k],
                        ableToRevert: persistentSettings[k] !== undefined
                    };
                }
            }

            setInterimSettings(prevSettings => (
                {...prevSettings, ...additionalSettings}
            ));
            setDisplaySettings(Object.keys(bttMetaContent));
        }
    }, [interimSubType]);

    //Calculate Is There Any Settings Waiting For Apply?

    //Calculate Is There Any Settings Waiting For Revert?

    const ApplyModified = () => {
        let bttMetaContent = solutionMeta.BttMetas.find(m => m.BttType === interimSubType!.currentValue)?.Content ?? {}
        let applySettings : { [key:string] : any} = {}
        applySettings.SubType = interimSubType!.currentValue
        Object.keys(bttMetaContent).forEach(key => {
            applySettings[key] = interimSettings[key].currentValue;
        });

        console.log(applySettings);

        fetch(UpdateBehaviourTreeNodeAPI, {
            method: 'POST',
            body: JSON.stringify(
                {
                    assetId: props.AssetId,
                    currentVersion: props.DocVersion,
                    nodeId: props.InspectNodeId,
                    settings: applySettings
                }
            )
        }).then(
            res => res.json()
        ).then(
            (res: UpdateBehaviourTreeNodeResponse) => {
                if(res.errCode === 0) {
                    setPersistentSettings(res.modificationInfo.diffNodesInfos[0].postModifiedNode!.settings!)
                    props.Helper.OnUpdatedBehaviourTreeNodeSettings(res.modificationInfo);
                }
            }
        )

    }

    const RevertModified = () => {
        let revertedSettings: { [key: string] : BttConfigurableSettingsItem } = {}
        Object.entries(interimSettings).forEach(([key, value]) => {
            if(value.ableToRevert){
                revertedSettings[key] = {...value, ...{ currentValue : value.persistentValue}}
            }
            else{
                revertedSettings[key] = {...value}
            }
        });
        setInterimSettings(revertedSettings);
    }

    if(interimSubType != null) {
        return (
            <div style={{
                padding: "5px",
                display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px"
            }}>
                <div>DocVersion: {props.DocVersion}</div>
                <div>NodeType: {props.NodeType}</div>
                <div>NodeId: {props.InspectNodeId}</div>
                <EnumEditorTerm
                    label={interimSubType.currentValue !== interimSubType.persistentValue ? "*TaskType" : "TaskType"}
                    key="TaskTypeKey"
                    currentItem={interimSubType.currentValue}
                    optionalItems={ValidBttTypes}
                    onValueChange={(type) => {
                        setInterimSubType(prevSubType => ({
                            currentValue: type,
                            persistentValue: prevSubType!.persistentValue
                        }))
                    }}
                />
                {

                    Object.entries(interimSettings).filter(([k, _]) => displaySettingKeys.includes(k)).map(([key, item]) => {
                            return (<SettingsEditableTerm key={key}
                                                          settingsLabel={item.currentValue !== item.persistentValue ? `*${key}` : key}
                                                          meta={item.meta}
                                                          value={item.currentValue}
                                                          onValueChange={
                                                              (value) => {
                                                                  let newItem = {...interimSettings[key], ... {currentValue: value}};
                                                                  setInterimSettings(prevSettings => ({...prevSettings, [key] : newItem}))
                                                              }
                                                          }/>)
                        }
                    )
                }
                <Button variant="contained" endIcon={<RevertIcon />} onClick={RevertModified}>
                    Revert
                </Button>
                <Button variant="contained" endIcon={<SendIcon />} onClick={ApplyModified}>
                    Apply
                </Button>
            </div>
        );
    }
    else{
        return null;
    }
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
