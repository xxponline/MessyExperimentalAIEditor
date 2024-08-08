import React from "react";
import ReactDragListView from "react-drag-listview"
import {ILogicBtdData} from "../../common/BtLogicDS";
import CollapsibleSection from "../CommonComponent/CollapsibleSection";
import {IBtdInspectorViewProps} from "../../viewmodels/BehaviourTree/BtdInspectorViewModel";
import SettingsEditableTerm from "../CommonComponent/SettingsEditableTerm";

export default class BtdInspectorView extends React.Component<IBtdInspectorViewProps, {}>
{

    render() {
        const that = this;
        const dragProps = {
            onDragEnd(fromIndex: number, toIndex: number) {
                const data = [...that.props.AttachedBTDs];
                const item = data.splice(fromIndex, 1)[0];
                data.splice(toIndex, 0, item);
                that.setState({ data });
            },
            nodeSelector: '.DraggableItem',
            handleSelector: '.DraggableTitle'
        };

        return (
            <div style={{width: "90%"}}>
            <CollapsibleSection title="BT Descriptors">
                <ReactDragListView {...dragProps}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px"}}>
                        {this.props.AttachedBTDs.map((btdItem, index) => this.RenderBtdItem(btdItem, index))}
                    </div>
                </ReactDragListView>
            </CollapsibleSection>
            </div>
        );
    }

    RenderBtdItem(btdItem : ILogicBtdData, index: number) : React.ReactNode {
        let BtdTypeMeta = this.props.BtdMetas.find(m => m.BtdType === btdItem.btdType);
        console.log(BtdTypeMeta);
        if(BtdTypeMeta)
        {
            return (
                <div key={index} className="DraggableItem" style={{padding: "10px", border: "1px solid black"}}>
                    <div className="DraggableTitle">{btdItem.btdType}</div>
                    {
                        Object.entries(BtdTypeMeta.Content).map(([key, metaItem]) =>
                            <SettingsEditableTerm key={key} settingsKey={key} meta={metaItem} value={btdItem[key]}
                                                  onValueChange={(value) => {}}/>
                        )
                    }
                </div>
            );
        }
        else{
            return (
                <div key={index} className="DraggableItem" style={{padding: "10px", border: "1px solid black"}}>
                    <div className="DraggableTitle" style={{ color:"red" }}>{btdItem.btdType}</div>
                </div>
            );
        }

    }

}
