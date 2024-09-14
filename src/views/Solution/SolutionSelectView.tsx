import React from "react";
import {
    GetSolutionDetailResponse,
    ListSolutionResponse,
    SolutionDetailItem,
    SolutionItem
} from "../../common/ResponseDS";
import {GetSolutionDetailAPI, ListSolutionsAPI} from "../../common/ServerAPI";
import {GeneralEnumEditorTerm} from "../CommonComponent/EnumEditableTerm";
import ExploreIcon from '@mui/icons-material/Explore';
import {Button} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

enum SolutionSelectMode {
    Loading,
    Select,
    Create,
}

class SolutionSelector extends GeneralEnumEditorTerm<SolutionItem> {
    override ToDisplayString(item: SolutionItem): string {
        return item.solutionName;
    }

    override ToIdentification(item: SolutionItem): string {
        return item.solutionId;
    }

    override  IdentificationToItem(id: string): SolutionItem {
        let result = this.props.optionalItems.find(item => item.solutionId === id);
        return result!;
    }
}

export class SolutionSelectView extends React.Component<{ OnSelectSolution: (solution: SolutionDetailItem) => void }, { mode: SolutionSelectMode, existSolutions : SolutionItem[]}>{
    constructor(props: any) {
        super(props);
        this.state = {
            mode: SolutionSelectMode.Loading,
            existSolutions: []
        }
    }

    private SelectedSolution : SolutionItem | null = null;

    componentDidMount() {
        this.RequestListAllSolutions()
    }

    private RequestListAllSolutions(): void {
        fetch(ListSolutionsAPI, {method: "GET"}).
        then(res => res.json()).
        then((data : ListSolutionResponse)  => {
            if(data.solutions.length > 0) {
                this.setState({ existSolutions: data.solutions, mode: SolutionSelectMode.Select });
                this.SelectedSolution = data.solutions[0];
            }
            else {

            }
        }).catch(
            //TODO
        );
    }

    private RequestSolutionDetail(id: string): void {
        fetch(GetSolutionDetailAPI, {
            method: "POST",
            body: JSON.stringify({ solutionId: id})
        }).
        then(res => res.json()).
        then((data : GetSolutionDetailResponse)  => {
            if(data.errCode === 0) {
                this.props.OnSelectSolution(data.solutionDetail);
            }
            else {

            }
        }).catch(
            //TODO
        );
    }

    private RequestCreateSolution(): void {

    }

    private DoSelectSolution(selectedItem : SolutionItem) {
        this.SelectedSolution = selectedItem;
    }

    private OnOpenClick() : void {
        if(this.SelectedSolution != null)
        {
            this.RequestSolutionDetail(this.SelectedSolution.solutionId);
        }
    }

    render() {
        switch (this.state.mode)
        {
            case SolutionSelectMode.Loading:
                return(null);
            case SolutionSelectMode.Select:
                return (
                    <div style={{ marginTop: "64px", display: "flex", alignItems: "center", flexDirection: "column" }}>
                        <div style={{ fontSize: "64px" }}>
                            <ExploreIcon fontSize="inherit" color="primary" />
                        </div>
                        <div style={{ width: "300px"}}>
                            <SolutionSelector
                                label="Select Solution"
                                currentItem={this.SelectedSolution!}
                                optionalItems={this.state.existSolutions}
                                onValueChange={(item) => { this.DoSelectSolution(item) }}
                            />
                        </div>
                        <div style={{marginTop: "16px"}}>
                            <Button variant="contained" endIcon={<SendIcon />} onClick={() => {this.OnOpenClick()}}>
                                Open Solution
                            </Button>
                        </div>
                    </div>
                );
            case SolutionSelectMode.Create:
                return (null);
        }
    }
}
