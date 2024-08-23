import React from "react";
import {TextField} from "@mui/material";

export class StringEditableTerm extends React.Component<
    {
        label: string,
        value: string,
        onValueChange?: ((value: string) => void)
    },
    {
        currentValue : string;
    }> {
    constructor(props: any) {
        super(props);
        this.state = {
            currentValue : this.props.value
        }
    }

    componentDidUpdate(prevProps: Readonly<{
        label: string;
        value: string;
        onValueChange?: (value: string) => void
    }>, prevState: Readonly<{ currentValue: string }>, snapshot?: any) {
        if(prevProps.value !== this.props.value)
        {
            this.setState({currentValue: this.props.value});
        }
    }

    private SetValue(value: string) {
        this.setState({currentValue: value});
        this.props.onValueChange?.(value);
    }

    render() {
        return(
            <TextField id="outlined-basic"
                       label={this.props.label}
                       value={this.state.currentValue}
                       onChange={(e) => { this.SetValue(e.target.value); }}
                       variant="standard"
                       fullWidth/>
        );
    }
}
