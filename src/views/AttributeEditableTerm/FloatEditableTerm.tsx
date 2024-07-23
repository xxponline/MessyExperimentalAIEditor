import React from "react";
import {TextField} from "@mui/material";

export class FloatEditableTerm extends React.Component<
    { label: string, defaultValue?: number },
    { value: number }> {
    constructor(props: any) {
        super(props);
        this.state = { value: this.props.defaultValue ?? 0.0 };
    }

    render() {
        return (
            <TextField id="outlined-basic"
                       label={this.props.label}
                       defaultValue={this.props.defaultValue ?? ""}
                       value={this.state.value}
                       onChange={(e) => {
                       }}
                       variant="standard"
                       fullWidth/>
        );
    }
}
