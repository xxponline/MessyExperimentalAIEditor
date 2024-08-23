import React from "react";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";


export class EnumEditorTerm extends React.Component<
    {
        currentItem: string,
        optionalItems: string[],
        label: string,
        onValueChange?: ((value: string) => void)
    },
    {
        currentValue : string
    }> {
    constructor(props: any) {
        super(props);
        this.state = {
            currentValue : this.props.currentItem,
        }
    }

    componentDidUpdate(prevProps: Readonly<{
        currentItem: string;
        optionalItems: string[];
        label: string;
        onValueChange?: (value: string) => void
    }>, prevState: Readonly<{ currentValue: string }>, snapshot?: any) {
        if( this.props.currentItem !== prevProps.currentItem) {
            this.setState({currentValue : this.props.currentItem});
        }
    }

    private SetValue(value: string) {
        this.setState({currentValue : value});
        this.props.onValueChange?.(value);
    }

    render() {
        return (
            <FormControl variant="standard" fullWidth>
                <InputLabel id="demo-simple-select-label">{this.props.label}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={ this.state.currentValue }
                    onChange={(e) => { this.SetValue(e.target.value) }}
                >
                    {
                        this.props.optionalItems.map(
                            (item : string) => <MenuItem key={item} value={item}>{item}</MenuItem>
                        )
                    }
                </Select>
            </FormControl>
        );
    }
}
