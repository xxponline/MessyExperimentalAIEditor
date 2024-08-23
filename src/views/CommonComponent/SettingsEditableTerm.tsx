import React from "react";
import {StringEditableTerm} from "./StringEditableTerm";
import {IntEditableTerm} from "./IntEditableTerm";
import {FloatEditableTerm} from "./FloatEditableTerm";
import {EnumEditorTerm} from "./EnumEditableTerm";
import {BooleanEditableTerm} from "./BooleanEditableTerm";

export default function SettingsEditableTerm(props: {settingsKey: string, meta: any, value: any, onValueChange: (value: any) => void}) {
    switch (props.meta.type) {
        case "String":
            return (
                <StringEditableTerm
                    value={props.value} label={props.settingsKey}
                    onValueChange = {(value) => props.onValueChange(value)}
                />
            );
        case "Int":
            return (
                <IntEditableTerm
                    value={props.value} label={props.settingsKey}
                    onValueChange = {(value) => props.onValueChange(value)}
                />
            );
        case "Float":
            return (
                <FloatEditableTerm
                    value={props.value} label={props.settingsKey}
                    onValueChange = {(value) => props.onValueChange(value)}
                />
            );
        case "Enum":
            //console.log(props);
            return (
                <EnumEditorTerm
                    label = {props.settingsKey}
                    currentItem = {props.value}
                    optionalItems = {props.meta.OptionalItems}
                    onValueChange = {(value) => props.onValueChange(value)}
                />
            );
        case "Boolean":
            return (
                <BooleanEditableTerm
                    label={props.settingsKey} value={props.value}
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
