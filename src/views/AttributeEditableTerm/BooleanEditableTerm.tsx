import React from "react";
import {Checkbox, FormControlLabel, Switch} from "@mui/material";

export class BooleanEditableTerm extends React.Component<
    { label: string, defaultValue: boolean, onValueChange?: ((value: boolean) => void) },
    { checked: boolean }> {
    constructor(props : any) {
        super(props);
        this.state = {
            checked: this.props.defaultValue
        }
    }

    private SwitchChecked() {
        this.setState((prevState) => ({
            checked: !prevState.checked
        }));
        if(this.props.onValueChange) {
            this.props.onValueChange!(this.state.checked);
        }

    }

    render() {
        return(
            <FormControlLabel onClick={() => {this.SwitchChecked()}}
                              control={<Switch checked={this.state.checked} />}
                              label={this.props.label} />
        );
    }
}
