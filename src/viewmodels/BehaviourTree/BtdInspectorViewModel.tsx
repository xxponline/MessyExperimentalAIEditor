import React from "react";
import BtdInspectorView from "../../views/BehaviourTree/BtdInspectorView";
import {BehaviourTreeModel, IInspectorFocusChangedListener} from "../../models/BehaviourTreeModel";
import {ILogicBtdData} from "../../common/BtLogicDS";
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";
import {BtdNodeMeta, BtNodeType, IMetaContentItem} from "../../common/BtCommon";
import {IBtNodeInspectorHelper} from "./BtNodeInspectorViewModel";

export interface IBtdInspectorViewProps {
    InspectNodeId: string | null;
    BtdMetas: BtdNodeMeta[];
    AttachedBTDs: ILogicBtdData[];

    Helper: IBtdInspectorHelper
}

export interface IBtdInspectorHelper {
    UpdateBtdSetting(btdId: string, settingItermKey: string, settingValue: any): void;
    OnMoveItem(fromIdx: number, toIdx: number): void;
    CreateBtdNode(btdType: string): void;
    RemoveBtdNode(btdNodeId: string): void;
}


export class BtdInspectorViewModel
    extends React.Component<any,Pick<IBtdInspectorViewProps, 'InspectNodeId' | 'AttachedBTDs'>>
    implements IInspectorFocusChangedListener, IBtdInspectorHelper
{
    constructor(props: any) {
        super(props);
        this.state = {
            InspectNodeId: null,
            AttachedBTDs: []
        }
    }

    UpdateBtdSetting(btdId: string, settingItermKey: string, settingValue: any): void {
        BehaviourTreeModel.Instance.UpdateDescriptorSettings(this.state.InspectNodeId!, btdId, settingItermKey, settingValue);
    }
    CreateBtdNode(btdType: string): void {
        BehaviourTreeModel.Instance.CreateEditingDescriptor(this.state.InspectNodeId!, btdType);
        this.setState({AttachedBTDs: BehaviourTreeModel.Instance.GetEditingBtAssetDescriptors(this.state.InspectNodeId!)});
    }
    RemoveBtdNode(btdNodeId: string): void {
        BehaviourTreeModel.Instance.RemoveEditingDescriptor(this.state.InspectNodeId!,btdNodeId);
        this.setState({AttachedBTDs: BehaviourTreeModel.Instance.GetEditingBtAssetDescriptors(this.state.InspectNodeId!)});
    }

    OnMoveItem(fromIdx: number, toIdx: number): void {
        BehaviourTreeModel.Instance.MoveEditingDescriptor(this.state.InspectNodeId!, fromIdx, toIdx );
        this.setState({AttachedBTDs: BehaviourTreeModel.Instance.GetEditingBtAssetDescriptors(this.state.InspectNodeId!)});
    }

    componentDidMount() {
        BehaviourTreeModel.Instance.RegisterInspectNodeChangeListener(this);
    }

    componentWillUnmount() {
        BehaviourTreeModel.Instance.UnRegisterInspectNodeChangeListener(this);
    }

    OnInspectorFocusChanged(nodeId: string | null): void {
        this.setState({InspectNodeId: nodeId});
        if(nodeId !== null)
        {
            this.setState({AttachedBTDs: BehaviourTreeModel.Instance.GetEditingBtAssetDescriptors(nodeId)});
        }
    }

    render() {
        return this.state.InspectNodeId !== null ? <BtdInspectorView {...this.state} BtdMetas={BehaviourTreeModel.Instance.GetBTDMetas()} Helper={this} /> : (null);
    }
}
