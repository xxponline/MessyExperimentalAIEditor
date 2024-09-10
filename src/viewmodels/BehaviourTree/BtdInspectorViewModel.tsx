import React from "react";
import BtdInspectorView from "../../views/BehaviourTree/BtdInspectorView";
import {BehaviourTreeModel, IInspectorFocusChangedListener} from "../../models/BehaviourTreeModel";
import {ILogicBtDescriptor} from "../../common/BtLogicDS";
import {BtdNodeMeta} from "../../common/BtCommon";
import {IBtdDisplayNode} from "../../common/BtDisplayDS";

export interface IBtdInspectorViewProps {
    InspectNodeId: string | null;
    BtdMetas: BtdNodeMeta[];
    AttachedBTDs: IBtdDisplayNode[];

    Helper: IBtdInspectorHelper
}

export interface IBtdInspectorHelper {
    UpdateBtdSettings(btdId: string, settingItermKey: string, settingValue: any): void;
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

    private BtdLogicTransformToBtdDisplay(logics: ILogicBtDescriptor[]) : IBtdDisplayNode[]
    {
        let displayNodes = logics.map(n => {
            return {
                id: n.id,
                ...n.data
            }
        });
        //displayNodes.sort((a,b) => a.Order - b.Order);
        return displayNodes;
    }

    UpdateBtdSettings(btdId: string, settingItermKey: string, settingValue: any): void {
        BehaviourTreeModel.Instance.UpdateDescriptorSettings(this.state.InspectNodeId!, btdId,{[settingItermKey] : settingValue});
    }
    CreateBtdNode(btdType: string): void {
        BehaviourTreeModel.Instance.CreateEditingDescriptor(this.state.InspectNodeId!, btdType);
        this.RefreshRenderDescriptors(null);
    }
    RemoveBtdNode(btdNodeId: string): void {
        BehaviourTreeModel.Instance.RemoveEditingDescriptor(btdNodeId);
        this.RefreshRenderDescriptors(null);
    }

    OnMoveItem(fromIdx: number, toIdx: number): void {
        BehaviourTreeModel.Instance.MoveEditingDescriptor(this.state.InspectNodeId!, fromIdx, toIdx );
        this.RefreshRenderDescriptors(null);
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
            this.RefreshRenderDescriptors(nodeId);
        }
    }

    private RefreshRenderDescriptors(newAttachTo: string | null): void {
        let attachedBtds : IBtdDisplayNode[] =
            this.BtdLogicTransformToBtdDisplay(BehaviourTreeModel.Instance.GetEditingBtAssetDescriptors(newAttachTo == null ? this.state.InspectNodeId! : newAttachTo));
        this.setState({AttachedBTDs: attachedBtds});
    }

    render() {
        return this.state.InspectNodeId !== null ? <BtdInspectorView {...this.state} BtdMetas={BehaviourTreeModel.Instance.GetBTDMetas()} Helper={this} /> : (null);
    }
}
