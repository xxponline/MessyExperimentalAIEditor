import React from "react";
import {BtNodeInspectorView} from "../../views/BehaviourTree/BtNodeInspectorView";
import {BehaviourTreeModel} from "../../models/BehaviourTreeModel";

export interface IBtNodeInspectorViewProps {
    ValidTypes: Array<string>,
    CurrentType: string,
    SettingContent: {},

    Helper: IBtNodeInspectorHelper
}

export interface IBtNodeInspectorHelper {
    SelectType(currentTypeName: string): void;
}



export class BtNodeInspectorViewModel extends React.Component<{},IBtNodeInspectorViewProps>
    implements IBtNodeInspectorHelper {
    constructor(props: IBtNodeInspectorViewProps) {
        super(props);
        this.state = {
            ValidTypes: [],
            CurrentType: "",
            SettingContent: {},

            Helper: this
        }
    }

    componentDidMount() {
        this.SelectType("Debug");
    }

    componentWillUnmount() {

    }

    public SelectType(currentTypeName: string) {
        let types = BehaviourTreeModel.Instance.GetBTTTypes();
        let currentType = types.find(
            (t) => t.taskType === currentTypeName
        );
        if(currentType) {
            this.setState({
                ValidTypes: types.map((t) => t.taskType),
                CurrentType: currentTypeName,
                SettingContent: currentType.Content
            });
        }
    }



    render() {
        return <BtNodeInspectorView {...this.state} />;
    }
}
