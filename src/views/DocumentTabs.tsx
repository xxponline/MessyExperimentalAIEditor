import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {IAssetSummaryForTab} from "../common/BtDisplayDS";
import {NewBtEditorView} from "./BehaviourTree/BtAssetEditorView";

export default function DocumentTabs(props: { openingDocuments: IAssetSummaryForTab[] }) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', height: '93%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    {
                        props.openingDocuments.map((doc, i) => { return <Tab key={doc.assetId} label={doc.assetName} id={doc.assetId} /> })
                    }
                </Tabs>
            </Box>
            {
                props.openingDocuments.map((doc, i) => { return <DocumentTabPanel key={doc.assetId} selectedIndexValue={value} index={i} {...doc} />})
            }
        </Box>
    );
}

function DocumentTabPanel(props: IAssetSummaryForTab & { selectedIndexValue: number, index: number }) {
    const { selectedIndexValue, index } = props;
    if(props.assetType === "BehaviourTree") {
        return (
            <div style={{ height: "100%" }}
                hidden={selectedIndexValue !== index}
            >
                {selectedIndexValue === index &&
                    <NewBtEditorView {...props} />
                }
            </div>
        );
    }
    else if(props.assetType === "BlackBoard") {
        return (
            <div
                hidden={selectedIndexValue !== index}
            >
                {selectedIndexValue === index &&
                    <Box sx={{p: 3}}> {props.assetName} : {props.assetId}</Box>
                }
            </div>
        );
    } else {
        return (<div>Error AssetType: {props.assetType}</div>);
    }
}
