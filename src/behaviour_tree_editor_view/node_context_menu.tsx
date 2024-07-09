import React from "react";
import {BehaviourTreeEditHelper} from "./behaviour_tree_edit_helper";

export default class NodeContextMenu extends React.Component<{helper: BehaviourTreeEditHelper, localInfo: any}>{
    render() {
        const helper = this.props.helper;
        return (
            <div
                style={ this.props.localInfo }
                className="context-menu"
            >
                <p style={{margin: '0.5em'}}>
                    {/*<small>node: {this.props.toolUtils.SelectedNodes![0].id}</small>*/}
                </p>
                <button onClick={()=>{}}>duplicate</button>
                <button onClick={()=>{ helper.RemoveSelectedNodes() }}>delete</button>
            </div>
        );
    }
}
