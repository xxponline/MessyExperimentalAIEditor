import React, {useEffect, useRef} from "react";
import {
    CreateSolutionResponse,
    GetSolutionDetailResponse,
    ListSolutionResponse,
    SolutionDetailItem,
    SolutionItem
} from "../../common/ResponseDS";
import {CreateSolutionAPI, GetSolutionDetailAPI, ListSolutionsAPI} from "../../common/ServerAPI";
import {GeneralEnumEditorTerm} from "../CommonComponent/EnumEditableTerm";
import ExploreIcon from '@mui/icons-material/Explore';
import {Button, IconButton, TextField} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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

export function SolutionSelectView(props: { OnSelectSolution: (solution: SolutionDetailItem) => void }) {
    const [viewMode, setViewMode] = React.useState(SolutionSelectMode.Loading);
    const [existSolutions, setExistSolutions] = React.useState<SolutionItem[]>([]);
    const [selectedSolution, setSelectedSolution] = React.useState<SolutionItem | null>(null);

    useEffect(() => {
        fetch(ListSolutionsAPI, {method: "GET"}).
        then(res => res.json()).
        then((data : ListSolutionResponse)  => {
            console.log(data);
            if(data.solutions && data.solutions.length > 0) {
                setExistSolutions(data.solutions);
                setSelectedSolution(data.solutions[0]);
                setViewMode(SolutionSelectMode.Select);
            }
            else {
                setViewMode(SolutionSelectMode.Create);
            }
        }).catch(
            //TODO
        );
    }, []);

    const OpenSolution = () => {
        if (selectedSolution === null) {
            return;
        }
        fetch(GetSolutionDetailAPI, {
            method: "POST",
            body: JSON.stringify({ solutionId: selectedSolution.solutionId})
        }).
        then(res => res.json()).
        then((data : GetSolutionDetailResponse)  => {
            if(data.errCode === 0) {
                props.OnSelectSolution(data.solutionDetail);
            }
            else {

            }
        }).catch(
            //TODO
        );
    }

    const createSolutionNameRef = useRef<HTMLInputElement>();
    const CreateSolution = () => {
        let solutionName = createSolutionNameRef.current?.value;
        if((solutionName?.length ?? 0) > 0)
        {
            fetch(CreateSolutionAPI, {
                method: "POST",
                body: JSON.stringify({ solutionName: solutionName})
            }).
            then(res => res.json()).
            then((result : CreateSolutionResponse)  => {
                console.log(result);
                if(result.errCode === 0) {
                    setExistSolutions(result.solutions);
                    setSelectedSolution(result.solutions.find(m => m.solutionId === result.newSolutionId)!);
                    setViewMode(SolutionSelectMode.Select);
                }
            }).catch(
                //TODO
            );
        }
    }

    switch (viewMode)
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
                            currentItem={selectedSolution!}
                            optionalItems={existSolutions}
                            onValueChange={(item) => { setSelectedSolution(item) }}
                        />
                    </div>
                    <div style={{marginTop: "16px"}}>
                        <Button variant="contained" endIcon={<SendIcon />} onClick={OpenSolution}>
                            Open Solution
                        </Button>
                    </div>
                    <div style={{marginTop: "16px"}}>
                        <IconButton aria-label="add" onClick={() => {setViewMode(SolutionSelectMode.Create)}}>
                            <AddCircleOutlineIcon/>
                        </IconButton>
                    </div>
                </div>
            );
        case SolutionSelectMode.Create:
            return (
                <div style={{marginTop: "64px", display: "flex", alignItems: "center", flexDirection: "column"}}>
                    <div style={{fontSize: "64px"}}>
                        <ExploreIcon fontSize="inherit" color="primary"/>
                    </div>
                    <div style={{width: "300px"}}>
                        <TextField
                            fullWidth
                            inputRef={createSolutionNameRef}
                            style={{margin: "10px 5px"}}
                            label="New Solution Name"
                            id="standard-size-small"
                            size="small"
                            variant="standard"
                        />
                    </div>
                    <div style={{marginTop: "16px"}}>
                        <Button variant="contained" endIcon={<AddCircleOutlineIcon/>} onClick={CreateSolution}>
                            Create Solution
                        </Button>
                    </div>
                    <div style={{marginTop: "16px"}}>
                        <IconButton aria-label="back" disabled={existSolutions.length === 0} onClick={() => {setViewMode(SolutionSelectMode.Select)}}>
                            <ArrowBackIcon/>
                        </IconButton>
                    </div>
                </div>
            )
    }
}
