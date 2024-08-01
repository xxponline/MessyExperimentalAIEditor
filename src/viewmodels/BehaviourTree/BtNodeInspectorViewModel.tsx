import React from "react";
import {BtNodeInspectorView} from "../../views/BehaviourTree/BtNodeInspectorView";
import {BehaviourTreeModel, IInspectorFocusChangedListener} from "../../models/BehaviourTreeModel";
import {BtNodeType} from "../../common/BtCommon";
import {IBttNodeData} from "../../models/BtLogicDataStructure";

export interface IBtNodeInspectorViewProps {
    BttViewInfo: {
        ValidTypes: Array<string>;
        CurrentType: string;
        SettingTerms: {};
        SettingContent: { [key: string] : any };
    } | null

    NodeType : BtNodeType
    InspectNodeId: string | null;

    Helper: IBtNodeInspectorHelper
}

export interface IBtNodeInspectorHelper {
    UpdateBttType(currentTypeName: string): void;

    UpdateSettings(settingItermKey: string, settingValue: any): void;
}




export class BtNodeInspectorViewModel extends React.Component<{},IBtNodeInspectorViewProps>
    implements IBtNodeInspectorHelper, IInspectorFocusChangedListener {
    constructor(props: IBtNodeInspectorViewProps) {
        super(props);
        this.state = {
            BttViewInfo: null,
            NodeType : "bt_selector",
            InspectNodeId: null,

            Helper: this
        }
    }

    OnInspectorFocusChanged(nodeId: string | null): void {
        if(nodeId !== null) {
            let node = BehaviourTreeModel.Instance.GetEditingBtAssetContentNodes().find((m) => m.id === nodeId);
            if(node) {
                if(node.type === "bt_task") {
                    let bttData = node.data!;
                    let types = BehaviourTreeModel.Instance.GetBTTTypes();
                    let currentType = types.find(
                        (t) => t.BttType === bttData.BttType
                    );
                    this.setState({
                        InspectNodeId: nodeId,
                        NodeType: "bt_task",
                        BttViewInfo: {
                            ValidTypes: types.map((t) => t.BttType),
                            CurrentType: node.data!.BttType,
                            SettingTerms: currentType!.Content,
                            SettingContent: node.data!
                        }
                    });
                }
                else {
                    this.setState({NodeType: node.type, InspectNodeId: node.id});
                }
            }
            else {
                this.setState({InspectNodeId: null});
            }
        }
        else {
            this.setState({InspectNodeId: null});
        }
    }

    componentDidMount() {
        BehaviourTreeModel.Instance.SetInspectNodeChangeListener(this);
    }

    componentWillUnmount() {
        BehaviourTreeModel.Instance.SetInspectNodeChangeListener(null);
    }

    public UpdateBttType(newBttType: string) {
        let currentNodeId = BehaviourTreeModel.Instance.CurrentInspectorFocusId;
        if(currentNodeId === null) {
            return;
        }

        let node = BehaviourTreeModel.Instance.GetEditingBtAssetContentNodes().find((m) => m.id === currentNodeId);
        if(node === undefined) {
            return;
        }

        if(node.type !== "bt_task") {
            return;
        }

        let bttData : IBttNodeData = node.data as IBttNodeData;

        if(bttData.BttType === newBttType) {
            return;
        }

        let types = BehaviourTreeModel.Instance.GetBTTTypes();
        let currentType = types.find(
            (t) => t.BttType === newBttType
        );

        BehaviourTreeModel.Instance.UpdateNodeDetailInEditingDocument(this.state.InspectNodeId!, {
            BttType: newBttType,
        });

        if(currentType) {
            this.setState({
                BttViewInfo: {
                    ValidTypes: types.map((t) => t.BttType),
                    CurrentType: newBttType,
                    SettingTerms: currentType.Content,
                    SettingContent: bttData
                }
            });
        }
    }

    UpdateSettings(settingItermKey: string, settingValue: any): void {
        if(this.state.InspectNodeId) {
            let settingContent : { [key : string] : any } = {};
            settingContent[settingItermKey] = settingValue;
            BehaviourTreeModel.Instance.UpdateNodeDetailInEditingDocument(
                this.state.InspectNodeId!, settingContent
            );
        }
    }

    render() {
        return this.state.InspectNodeId !== null ? <BtNodeInspectorView {...this.state} /> : (null);
    }
}
