import React from "react";
import {BtNodeInspectorView} from "../../views/BehaviourTree/BtNodeInspectorView";
import {BehaviourTreeModel, IInspectorFocusChangedListener} from "../../models/BehaviourTreeModel";

export interface IBtNodeInspectorViewProps {
    ValidTypes: Array<string>;
    CurrentType: string;
    SettingTerms: {};
    SettingContent: { [key: string] : any };

    InspectNodeId: string | null;

    Helper: IBtNodeInspectorHelper
}

export interface IBtNodeInspectorHelper {
    UpdateType(currentTypeName: string): void;

    UpdateSettings(settingItermKey: string, settingValue: any): void;
}




export class BtNodeInspectorViewModel extends React.Component<{},IBtNodeInspectorViewProps>
    implements IBtNodeInspectorHelper, IInspectorFocusChangedListener {
    constructor(props: IBtNodeInspectorViewProps) {
        super(props);
        this.state = {
            ValidTypes: [],
            CurrentType: "",
            SettingTerms: {},
            SettingContent: {},

            InspectNodeId: null,

            Helper: this
        }
    }

    OnInspectorFocusChanged(nodeId: string | null): void {
        if(nodeId !== null) {
            let node = BehaviourTreeModel.Instance.GetEditingBtAssetContentNodes().find((m) => m.id === nodeId);
            if(node?.type === "bt_task") {
                let types = BehaviourTreeModel.Instance.GetBTTTypes();
                let currentType = types.find(
                    (t) => t.BttType === node!.data.BttType
                );
                this.setState({
                    InspectNodeId: nodeId,
                    ValidTypes: types.map((t) => t.BttType),
                    CurrentType: node!.data.BttType,
                    SettingTerms: currentType!.Content,
                    SettingContent: node!.data
                });
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

    public UpdateType(newBttType: string) {
        let currentNodeId = BehaviourTreeModel.Instance.CurrentInspectorFocusId;
        console.log("111111");
        console.log(newBttType);
        if(currentNodeId === null) {
            return;
        }

        let node = BehaviourTreeModel.Instance.GetEditingBtAssetContentNodes().find((m) => m.id === currentNodeId);
        if(node === undefined){
            return;
        }

        if(node.data.BttType === newBttType) {
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
                ValidTypes: types.map((t) => t.BttType),
                CurrentType: newBttType,
                SettingTerms: currentType.Content,
                SettingContent: node.data
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
        return this.state.InspectNodeId !== null ? <BtNodeInspectorView {...this.state} /> : (null)
    }
}
