import React from "react";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";



export class EnumEditorTerm extends React.Component<
    {
        currentItem: string,
        optionalItems: string[],
        label: string,
        onValueChange?: ((value: string) => void)
    },
    { currentItem: string }> {
    constructor(props: any) {
        super(props);
        this.state = {
            currentItem: this.props.currentItem
        }
    }

    private SelectItem(item: string) {
        this.setState( { currentItem: item } );
        if(this.props.onValueChange) {
            this.props.onValueChange!(item);
        }
    }


    render() {
        return (
            <FormControl variant="standard" fullWidth>
                <InputLabel id="demo-simple-select-label">{this.props.label}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={ this.state.currentItem }
                    onChange={(e) => { this.SelectItem(e.target.value) }}
                >
                    {
                        this.props.optionalItems.map((item : string) => <MenuItem value={item}>{item}</MenuItem>)
                    }
                </Select>
            </FormControl>
        );
    }
}
