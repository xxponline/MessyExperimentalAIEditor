import React, {useEffect, useState} from "react";
import {IEditorFrameworkRenderParameters} from "../viewmodels/BehaviourTreeEditorFramework";
import {Button, Dialog} from "@mui/material";
import {SolutionSelectView} from "./Solution/SolutionSelectView";
import {SolutionItem} from "../common/ResponseDS";
import {AssetsExplorer} from "./AssetsManagement/AssetsExplorer";
import DocumentTabs from "./DocumentTabs";
import {IAssetSummaryForTab} from "../common/BtDisplayDS";

export class EditorFrameworkView extends React.Component<
        IEditorFrameworkRenderParameters,
        { solution: SolutionItem | null, assetsExplorerOpen: boolean, openingDocuments: IAssetSummaryForTab[] }
    >
{
    constructor(props: any) {
        super(props);
        this.state = {
            solution: null,
            assetsExplorerOpen: false,
            openingDocuments: []
        }
    }

    private OpenDocument(info: IAssetSummaryForTab) {
        this.setState((prevState) => ( { assetsExplorerOpen: false, openingDocuments: prevState.openingDocuments.concat(info)} ));
    }

    render() {
        // return (<Example/>);
        if(this.state.solution == null) {
            // renderResult = (
            //
            // );
            return (<SolutionSelectView OnSelectSolution={(solution) => {this.setState({ solution: solution })}} />);
        }
        else {
            return (
                <div>
                    <Dialog maxWidth={false} onClose={() => {
                        this.setState({assetsExplorerOpen: false})
                    }} open={this.state.assetsExplorerOpen}>
                        <AssetsExplorer solutionId={this.state.solution.solutionId} OnOpenDocument={(info) => this.OpenDocument(info)}/>
                    </Dialog>
                    <div style={{width: "100vw", height: "100vh"}}>
                        <div style={{width: "100%", height: "3%", backgroundColor: "#ccc"}}>
                            <Button
                                // onClick={() => {
                                //     BehaviourTreeModel.Instance.RequestSaveCurrentBtDocumentation().
                                //     then((ack)=> {})
                                // }}
                            >Save</Button>
                            <Button onClick={(e) => {
                                e.preventDefault();
                                this.setState({assetsExplorerOpen: true})
                            }}>Open Explorer</Button>
                        </div>
                        <DocumentTabs openingDocuments={this.state.openingDocuments}/>
                        {/*<div style={{width: "100%", height: "92vh", display: "flex", flexDirection: "row"}}>*/}
                        {/*    <div style={{width: "10%"}}>*/}
                        {/*        <BtAssetExplorerViewModel/>*/}
                        {/*    </div>*/}
                        {/*    <div style={{width: "80%", backgroundColor: "green"}}>*/}
                        {/*        <BlackBoardViewModel/>*/}
                        {/*        /!*<BtAssetEditorViewModel/>*!/*/}
                        {/*    </div>*/}
                        {/*    <div style={{width: "10%"}}>*/}
                        {/*        <BtNodeInspectorViewModel/>*/}
                        {/*        <BtdInspectorViewModel/>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                </div>
            );
        }
    }
}


function Example() {
    const [leftCount, setLeftCount] = useState(0);
    const [rightCount, setRightCount] = useState(0);

    useEffect(() => {
        /**
         * This useEffect will be executed when:
         * 1、the component is mounted and unmounted.
         * 2、click left button.
         * 3、click right button.
         */
        console.log(`Button left clicked ${leftCount} times`);
        document.title = `Button left clicked ${leftCount} times`;
    });

    useEffect(() => {
        /**
         * This useEffect will be executed when:
         * 1、the component is mounted and unmounted.
         * 2、click right button.
         */
        console.log(`Button right clicked ${rightCount} times`);
    }, [rightCount]);

    useEffect(() => {
        /**
         * This useEffect will be executed when:
         * 1、the component is mounted and unmounted.
         */
        console.log(`I have a empty array of dependencies.`);
    }, []);

    return (
        <div className="flex">
            <div>
                <p>左按钮点击了 {leftCount} 次</p>
                <button onClick={() => setLeftCount(leftCount + 1)}>左按钮</button>
            </div>
            <div>
                <p>右按钮点击了 {rightCount} 次</p>
                <button onClick={() => setRightCount(rightCount + 1)}>右按钮</button>
            </div>
        </div>
    );
}
