import React from "react";
import {FormControlLabel, Switch} from "@mui/material";

export class BooleanEditableTerm extends React.Component<
    {
        label: string,
        value: boolean,
        onValueChange?: ((value: boolean) => void)
    },
    {
        currentValue : boolean;
    } > {
    constructor(props : any) {
        super(props);
        this.state = {
            currentValue : this.props.value
        }
    }

    private SetValue(value: boolean) {
        this.setState({currentValue : value});
        this.props.onValueChange?.(value);
    }

    render() {
        return(
            <FormControlLabel control={
                <Switch
                    checked={this.state.currentValue}
                    onChange={ (e) => this.SetValue(e.target.checked) }
                />
            } label={this.props.label} />
        );
    }
}
