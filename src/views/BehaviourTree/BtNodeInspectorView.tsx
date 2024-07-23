import React from "react";
import {IBtNodeInspectorViewProps} from "../../viewmodels/BehaviourTree/BtNodeInspectorViewModel";
import {FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField} from "@mui/material";
import {NumericFormat, NumericFormatProps} from "react-number-format";
import {BooleanEditableTerm} from "../AttributeEditableTerm/BooleanEditableTerm";
import {EnumEditorTerm} from "../AttributeEditableTerm/EnumEditableTerm";
import {StringEditableTerm} from "../AttributeEditableTerm/StringEditableTerm";
import {IntEditableTerm} from "../AttributeEditableTerm/IntEditableTerm";
import {FloatEditableTerm} from "../AttributeEditableTerm/FloatEditableTerm";

export class BtNodeInspectorView extends React.Component<
    IBtNodeInspectorViewProps,
    {}> {

    constructor(props: IBtNodeInspectorViewProps) {
        super(props);
    }

    private setCurrentTaskType(taskType: string) {
        this.setState( { currentType: taskType } );
    }

    private elementRef = React.createRef<HTMLInputElement>();

    render() {
        return (
            <div style={{ position: "absolute", width: "300px", height: "500px",
                backgroundColor: "#ffffffe0", top: "50px", right: "100px", zIndex: 5, padding: "10px",
                display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px"
            }}>

                <EnumEditorTerm label="TaskType"
                                currentItem={this.props.CurrentType}
                                optionalItems={this.props.ValidTypes}
                                onValueChange={(type) => { this.props.Helper.SelectType(type) }}
                />
                {
                    Object.entries(this.props.SettingContent).map(([key, item]) =>
                        this.RenderContentItem(key, item)
                    )
                }
            </div>
        );
    }

    private RenderContentItem(key: string, content: any) : React.ReactNode {
        switch (content.type) {
            case "String":
                return (
                    <StringEditableTerm label={key} />
                );
            case "Int":
                return (
                    <IntEditableTerm defaultValue={0} label={key} />
                );
            case "Float":
                return (
                    <FloatEditableTerm defaultValue={0.1} label={key} />
                );
            case "Enum":
               return (
                   <EnumEditorTerm label={key} currentItem={content.OptionalItems[0]} optionalItems={content.OptionalItems} />
               );
            case "Boolean":
                return (
                    <BooleanEditableTerm label={key} defaultValue={false} />
                );
            // case "BBKey":
            //     return (
            //         <div>
            //             <label>{key}:</label>
            //             <input type="text"></input>
            //         </div>
            //     );
        }
    }
}

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

const NumericFormatCustom = React.forwardRef<NumericFormatProps, CustomProps>(
    function NumericFormatCustom(props, ref) {
        const { onChange, ...other } = props;

        return (
            <NumericFormat
                {...other}
                getInputRef={ref}
                onValueChange={(values) => {
                    onChange({
                        target: {
                            name: props.name,
                            value: values.value,
                        },
                    });
                }}
                valueIsNumericString
            />
        );
    },
);
