export function BtAssetExplorerView(){
    return (null)
}


// import React from "react";
// import {SimpleTreeView, TreeItem, TreeItem2, TreeItem2Label} from "@mui/x-tree-view";

// interface CustomizeTreeItemLabelProps {
//     btAssetGuid: string;
//     isSelected: boolean;
//     children: string;
//     OpenBtAsset: (guid: string) => void;
// }

// function CustomizeTreeItemLabel(props : CustomizeTreeItemLabelProps) {
//     return (
//         <div style={{ display: "flex", flexDirection: "column" }}>
//             <TreeItem2Label children={ props.children }/>
//             <button hidden={!props.isSelected} onClick={() => { props.OpenBtAsset(props.btAssetGuid) } }>load</button>
//         </div>
//     );
// }


// export class BtAssetExplorerView extends
//     React.Component<IBtAssetExplorerRenderParameters, { selectedItemId : string | null }> {
//     constructor(props: IBtAssetExplorerRenderParameters) {
//         super(props);
//         this.state = { selectedItemId: null }
//     }
//
//     OnSelectedItemsChanged(itemId: string | null) {
//         this.setState( { selectedItemId: itemId } );
//     }
//
//     render() {
//         return (
//             <SimpleTreeView onSelectedItemsChange={(e,Id) => this.OnSelectedItemsChanged(Id)}>
//                 {
//                     this.RecursiveCreateTreeItem(this.props.root, true)
//                 }
//             </SimpleTreeView>
//         );
//     }
//
//     RecursiveCreateTreeItem(node: PathNode, isRoot: boolean) : React.ReactNode {
//         if(isRoot) {
//             return node.children.map((el) => this.RecursiveCreateTreeItem(el, false));
//         }
//         else {
//             if(node.type === 'd') {
//                 return (
//                     <TreeItem2 key={node.guid} itemId={node.guid} label={node.name}>
//                         {
//                             node.children.map((el) => this.RecursiveCreateTreeItem(el, false))
//                         }
//                     </TreeItem2>
//                 );
//             }
//             else {
//                 let slotLabelProps : any = {
//                     isSelected: false,
//                     btAssetGuid: node.guid,
//                     OpenBtAsset: this.props.OpenBtAsset
//                 };
//                 if(node.guid === this.state.selectedItemId) {
//                     slotLabelProps.isSelected = true;
//                 }
//                 return (
//                     <TreeItem2 slots={{label: CustomizeTreeItemLabel}} slotProps={{ label: slotLabelProps}}
//                         key={node.guid} itemId={node.guid} label={node.name} />
//                 );
//             }
//         }
//     }
// }

