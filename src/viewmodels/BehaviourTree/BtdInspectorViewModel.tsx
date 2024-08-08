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
    UpdateBtdSetting(settingItermKey: string, settingValue: any): void;
    CreateBtdNode(): void;

}


export class BtdInspectorViewModel
    extends React.Component<any,Pick<IBtdInspectorViewProps, 'InspectNodeId' | 'AttachedBTDs'>>
    implements IInspectorFocusChangedListener, IBtdInspectorHelper
{

    private data: ILogicBtdData[] = [];

    constructor(props: any) {
        super(props);
        this.state = {
            InspectNodeId: null,
            AttachedBTDs: []
        }
        for (let i = 0, len= 6; i < len; i++) {
            if(i % 2 == 0)
            {
                this.data.push({
                    id: generateUniqueID(),
                    btdType: 'BTD_ForceSuccess',
                    order: i
                });
            }
            else{
                this.data.push({
                    id: generateUniqueID(),
                    btdType: 'BTD_CoolDown',
                    order: i,
                    CoolDownTime: 1,
                    IgnoreTimeScale: false
                });
            }
        }

    }

    UpdateBtdSetting(settingItermKey: string, settingValue: any): void {
        throw new Error("Method not implemented.");
    }
    CreateBtdNode(): void {
        throw new Error("Method not implemented.");
    }

    componentDidMount() {
        BehaviourTreeModel.Instance.RegisterInspectNodeChangeListener(this);
    }

    componentWillUnmount() {
        BehaviourTreeModel.Instance.UnRegisterInspectNodeChangeListener(this);
    }

    OnInspectorFocusChanged(nodeId: string | null): void {
        this.setState({InspectNodeId: nodeId, AttachedBTDs: this.data});
    }

    render() {
        return this.state.InspectNodeId !== null ? <BtdInspectorView {...this.state} BtdMetas={BehaviourTreeModel.Instance.GetBTDMetas()} Helper={this} /> : (null);
    }
}
