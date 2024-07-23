import React from "react";
import {TextField} from "@mui/material";

export class StringEditableTerm extends React.Component<
    { label: string, defaultValue?: string, onValueChange?: ((value: string) => void)},
    { value: string }> {
    constructor(props: any) {
        super(props);
        this.state = {
            value: this.props.defaultValue ?? ""
        }
    }

    private SetValue(v: string) {
        this.setState({value: v})
        if(this.props.onValueChange) {
            this.props.onValueChange!(this.state.value);
        }
    }

    render() {
        return(
            <TextField id="outlined-basic"
                       label={this.props.label}
                       value={this.state.value}
                       onChange={(e) => {this.SetValue(e.target.value)}}
                       variant="standard"
                       fullWidth/>
        );
    }
}
