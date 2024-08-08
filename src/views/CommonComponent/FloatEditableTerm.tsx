import React from "react";
import {TextField} from "@mui/material";
import {NumericFormat} from "react-number-format";

export class FloatEditableTerm extends React.Component<
    {
        label: string,
        value: number,
        onValueChange?: ((value: number) => void)
    },
    {
        currentValue : number;
    }> {
    constructor(props: any) {
        super(props);
        this.state = {
            currentValue : this.props.value
        }
    }

    private SetValue(value: number | undefined) {
        if(value !== undefined) {
            this.setState({currentValue : value});
        }
        else {
            this.setState({currentValue : 0});
        }
    }

    private CheckAndSave() {
        this.props.onValueChange?.(this.state.currentValue);
    }

    render() {
        return (
            <NumericFormat
                label={this.props.label}
                value={this.state.currentValue}
                customInput={TextField}
                onValueChange={(v) => { this.SetValue(v.floatValue); this.CheckAndSave()}}
                variant="standard"
                thousandSeparator
                fullWidth/>
        );
    }
}
