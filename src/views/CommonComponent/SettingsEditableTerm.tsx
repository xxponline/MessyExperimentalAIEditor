import React from "react";
import {StringEditableTerm} from "./StringEditableTerm";
import {IntEditableTerm} from "./IntEditableTerm";
import {FloatEditableTerm} from "./FloatEditableTerm";
import {EnumEditorTerm} from "./EnumEditableTerm";
import {BooleanEditableTerm} from "./BooleanEditableTerm";

export default function SettingsEditableTerm(props: {settingsLabel: string, meta: any, value: any, onValueChange: (value: any) => void}) {
    switch (props.meta.type) {
        case "String":
            return (
                <StringEditableTerm
                    value={props.value} label={props.settingsLabel}
                    onValueChange = {(value) => props.onValueChange(value)}
                />
            );
        case "Int":
            return (
                <IntEditableTerm
                    value={props.value} label={props.settingsLabel}
                    onValueChange = {(value) => props.onValueChange(value)}
                />
            );
        case "Float":
            return (
                <FloatEditableTerm
                    value={props.value} label={props.settingsLabel}
                    onValueChange = {(value) => props.onValueChange(value)}
                />
            );
        case "Enum":
            return (
                <EnumEditorTerm
                    label = {props.settingsLabel}
                    currentItem = {props.value}
                    optionalItems = {props.meta.optionalItems}
                    onValueChange = {(value) => props.onValueChange(value)}
                />
            );
        case "Boolean":
            return (
                <BooleanEditableTerm
                    label={props.settingsLabel} value={props.value}
                    onValueChange = {(value) => props.onValueChange(value)}
                />
            );
        // case "BBKey":
        //     return (
        //         <div>
        //             <label>{key}:</label>
        //             <input type="text"></input>
        //         </div>
        //     );
        default:
            return (null);
    }
}
