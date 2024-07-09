import React from "react";

import "./behaviour_tree_context_menu.css"
import NodeContextMenu from "./node_context_menu";
import PaneContextMenu from "./pane_context_menu";
import EdgeContextMenu from "./edge_context_menu";
import {BehaviourTreeEditHelper} from "./behaviour_tree_edit_helper";
import {EditorContextEnum, MenuDirection} from "./behaviour_tree_type_define";

export default class BehaviourTreeContextMenu extends React.Component<{helper: BehaviourTreeEditHelper}>{
    render() {
        const localInfo = this.props.helper.MenuLocation(MenuDirection.RightDown);

        let renderContent: React.JSX.Element | null =  null
        switch (this.props.helper.editorContextType)
        {
            case EditorContextEnum.pane:
                renderContent = <PaneContextMenu helper={this.props.helper} localInfo={localInfo}/>
                break;
            case EditorContextEnum.edge:
                renderContent = <EdgeContextMenu helper={this.props.helper} localInfo={localInfo}/>
                break;
            case EditorContextEnum.node:
                renderContent = <NodeContextMenu helper={this.props.helper} localInfo={localInfo}/>
                break;
        }

        return (renderContent);
    }
}
