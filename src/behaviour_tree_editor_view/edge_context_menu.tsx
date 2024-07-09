import React from "react";
import {BehaviourTreeEditHelper} from "./behaviour_tree_edit_helper";

export default class EdgeContextMenu extends React.Component<{helper: BehaviourTreeEditHelper, localInfo: any}> {
    render() {
        const helper = this.props.helper;
        return (
            <div
                style={ this.props.localInfo }
                className="context-menu"
            >
                <p style={{margin: '0.5em'}}>
                    <small>edge: 1111</small>
                </p>
                <button onClick={()=>{helper.RemoveSelectedEdges()}}>delete</button>
            </div>
        );
    }
}
