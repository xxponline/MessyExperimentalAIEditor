import React from "react";
import {BtNodeInspectorView} from "../../views/BehaviourTree/BtNodeInspectorView";
import {BehaviourTreeModel, IInspectorFocusChangedListener} from "../../models/BehaviourTreeModel";
import {BtNodeType, IMetaContentItem} from "../../common/BtCommon";
import {IBttNodeData} from "../../common/BtLogicDS";

export interface IBtNodeInspectorViewProps {
    BttViewInfo: {
        ValidTypes: Array<string>;
        CurrentType: string;
        CurrentTypeMetaContent: IMetaContentItem;
        SettingsContent: { [key: string] : any };
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
                    let types = BehaviourTreeModel.Instance.GetBTTMetas();
                    let currentType = types.find(
                        (t) => t.BttType === bttData.BttType
                    );
                    this.setState({
                        InspectNodeId: nodeId,
                        NodeType: "bt_task",
                        BttViewInfo: {
                            ValidTypes: types.map((t) => t.BttType),
                            CurrentType: node.data!.BttType,
                            CurrentTypeMetaContent: currentType!.Content,
                            SettingsContent: node.data!
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
        BehaviourTreeModel.Instance.RegisterInspectNodeChangeListener(this);
    }

    componentWillUnmount() {
        BehaviourTreeModel.Instance.UnRegisterInspectNodeChangeListener(this);
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

        if(node.data!.BttType === newBttType) {
            return;
        }

        BehaviourTreeModel.Instance.UpdateNodeDetailInEditingDocument(this.state.InspectNodeId!, {
            BttType: newBttType,
        });

        let types = BehaviourTreeModel.Instance.GetBTTMetas();
        let currentType = types.find(
            (t) => t.BttType === newBttType
        );

        let refreshedNode = BehaviourTreeModel.Instance.GetEditingBtAssetContentNodes().find((m) => m.id === currentNodeId);

        if(currentType) {
            this.setState({
                BttViewInfo: {
                    ValidTypes: types.map((t) => t.BttType),
                    CurrentType: newBttType,
                    CurrentTypeMetaContent: currentType.Content,
                    SettingsContent: refreshedNode!.data!
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
