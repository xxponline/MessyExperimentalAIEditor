import React from "react";
import {BehaviourTreeEditHelper} from "./behaviour_tree_edit_helper";
import {BTNodeType} from "./behaviour_tree_type_define";

export default class PaneContextMenu extends React.Component<{helper: BehaviourTreeEditHelper, localInfo: any}> {
    CreateSelector() {

    }

    render() {
        const helper = this.props.helper;
        const localInfo = this.props.localInfo;

        return (
            <div style={ this.props.localInfo } className="context-menu">
                <p style={{margin: '0.5em'}}>
                    <small>create new node</small>
                </p>
                <button onClick={() => { helper.AddNode( BTNodeType.Selector, localInfo)
                }}>Create Selector
                </button>
                <button onClick={() => { helper.AddNode( BTNodeType.Sequence , localInfo)
                }}>Create Sequence
                </button>
                <button onClick={() => { helper.AddNode( BTNodeType.SimpleParallel, localInfo)
                }}>Create SimpleParallel
                </button>
                <button onClick={() => { helper.AddNode( BTNodeType.Task, localInfo )
                }}>Create Task
                </button>
            </div>
        );
    }
}
