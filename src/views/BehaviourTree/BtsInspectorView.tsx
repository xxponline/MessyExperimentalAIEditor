import React from "react";
import {ILogicBtdData} from "../../common/BtLogicDS";
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";
import CollapsibleSection from "../CommonComponent/CollapsibleSection";
import ReactDragListView from "react-drag-listview";

export default class BtsInspectorView extends React.Component<any, any>
{
    constructor(props : any) {
        super(props);

        const data: ILogicBtdData[] = [];
        for (let i = 0, len= 6; i < len; i++) {
            data.push({
                id: generateUniqueID(),
                BtdType: 'BTS_None',
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
                        {this.state.data.map((item : ILogicBtdData, index: number) => (
                            <li key={index}>
                                {item.btdType}
                                <a href="#">Drag</a>
                            </li>
                        ))}
                    </ol>
                </ReactDragListView>
            </CollapsibleSection>
        );
    }
}
