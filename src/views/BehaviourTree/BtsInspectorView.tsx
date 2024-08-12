import React from "react";
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";
import CollapsibleSection from "../CommonComponent/CollapsibleSection";
import ReactDragListView from "react-drag-listview";
import {IBtsDisplayNode} from "../../common/BtDisplayDS";

export default class BtsInspectorView extends React.Component<any, any>
{
    constructor(props : any) {
        super(props);

        const data: IBtsDisplayNode[] = [];
        for (let i = 0, len= 6; i < len; i++) {
            data.push({
                id: generateUniqueID(),
                BtsType: 'BTS_None',
                Order: i
            });
        }

        this.state = {
            data
        };
    }

    render() {
        const that = this;
        const dragProps = {
            onDragEnd(fromIndex: number, toIndex: number) {
                const data = [...that.state.data];
                const item = data.splice(fromIndex, 1)[0];
                data.splice(toIndex, 0, item);
                that.setState({ data });
            },
            nodeSelector: 'li',
            handleSelector: 'a'
        };

        return (
            <CollapsibleSection title="BT Services">
                <ReactDragListView {...dragProps}>
                    <ol>
                        {this.state.data.map((item : IBtsDisplayNode, index: number) => (
                            <li key={index}>
                                {item.BtdType}
                                <a href="#">Drag</a>
                            </li>
                        ))}
                    </ol>
                </ReactDragListView>
            </CollapsibleSection>
        );
    }
}
