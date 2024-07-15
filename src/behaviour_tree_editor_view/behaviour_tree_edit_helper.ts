import {addEdge, Connection, Node, XYPosition} from "reactflow";
import {Edge} from "@reactflow/core/dist/esm/types/edges";
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";
import {BTNode} from "./behaviour_tree_node_display";
import {
    BTNodeType,
    EditorContextEnum,
    MenuDirection,
    MenuLocalInfo,
    SetEdgesAction,
    SetNodesAction
} from "./behaviour_tree_type_define";
import {BehaviourTreeModel} from "../models/BehaviourTreeModel";


export class BehaviourTreeEditHelper {
    private readonly _setNodes :  SetNodesAction;
    private readonly _setEdges :  SetEdgesAction;
    constructor(allNodes : Array<Node>,  allEdges : Array<Edge>, setNodesAction : SetNodesAction, setEdgesAction : SetEdgesAction) {
        this._setNodes = setNodesAction;
        this._setEdges = setEdgesAction;
        this._allNodes = allNodes;
        this._allEdges = allEdges;
    }

    private _posX: number = 0;
    private _posY: number = 0;
    public Position(x: number, y: number): BehaviourTreeEditHelper {
        this._posX = x;
        this._posY = y;
        return this;
    }
    public get posX(): number {
        return this._posX;
    }
    public get posY(): number {
        return this._posY;
    }
    public MenuLocation(direction: MenuDirection) : MenuLocalInfo
    {
        return {x: this.posX, y: this.posY, top : this.posY, left : this.posX}
    }


    private _allNodes : Array<Node>;
    public get allNodes (): ReadonlyArray<Node> | null {
        return this._allNodes;
    }

    public _allEdges : Array<Edge>;
    public get allEdges (): ReadonlyArray<Edge> | null {
        return this._allEdges;
    }

    private _selectNodes : Array<Node> | null = null;
    public SelectNodes(nodes : Array<Node> | null): BehaviourTreeEditHelper {
        this._selectNodes = nodes;
        return this;
    }
    public get selectNodes (): ReadonlyArray<Node> | null {
        return this._selectNodes;
    }

    private _selectEdges : Array<Edge> | null = null;
    public get selectEdges (): ReadonlyArray<Edge> | null {
        return this._selectEdges;
    }
    public SelectEdges(edges : Array<Edge> | null): BehaviourTreeEditHelper {
        this._selectEdges = edges;
        return this;
    }

    private _editorContextType : EditorContextEnum = EditorContextEnum.none;
    public get editorContextType () : EditorContextEnum {
        return this._editorContextType;
    }
    public EditorContextType(type : EditorContextEnum) : BehaviourTreeEditHelper {
        this._editorContextType = type;
        return this;
    }


    public RemoveSelectedNodes()
    {
        let selectIds = this._selectNodes?.map((m) => m.id);
        if(selectIds != null)
        {
            this._setEdges((eds) => eds.filter(m=> (!selectIds!.includes(m.source) && !selectIds?.includes(m.target))));
            this._setNodes((nds) => nds.filter(m => !selectIds!.includes(m.id)));
        }
    }

    public RemoveSelectedEdges()
    {
        let selectIds = this._selectEdges?.map((m) => m.id);
        console.log(selectIds);
        if(selectIds != null)
        {
            this._setEdges((eds) => eds.filter(m => !selectIds!.includes(m.id)));
        }
    }

    public Link(connection: Connection) : boolean
    {
        const allNodeIds = this._allNodes.map(m => m.id);
        //check valid
        if(connection.source === null || connection.target === null)
        {
            return false;
        }
        else if(!allNodeIds?.includes(connection.source!) || !allNodeIds?.includes(connection.target))
        {
            return false;
        }

        //check loop
        {
            const loopCheckId = connection.source;
            let checkStack: Array<string> = [connection.target]
            while (checkStack.length > 0) {
                let currentCheckNodeId = checkStack.pop();
                let checkNode = this._allNodes.find(m => m.id === currentCheckNodeId);
                if (checkNode!.id === loopCheckId) {
                    return false;
                }

                let childEdges = this._allEdges.filter(m => m.source === currentCheckNodeId);

                for (let edge of childEdges) {
                    let waitSearchNode = this._allNodes.find(m => m.id === edge.target);
                    checkStack.push(waitSearchNode!.id);
                }
            }
        }

        //check duplicated edge
        {
            if(this._allEdges.some(m => m.source === connection.source && m.target === connection.target))
            {
                return false;
            }
        }

        let waitRemoveEdgeIds : Array<string> = [];
        //remove multi-parents
        {
            let checkChildNodeId = connection.target;
            let ids = this._allEdges.filter(m => m.target === checkChildNodeId).map(m => m.id);
            waitRemoveEdgeIds.push(... ids);
        }

        //remove multi-children if only single child acceptable

        //real link
        this._setEdges((edges) => addEdge(this.CreateEdge(connection),edges.filter(m => !waitRemoveEdgeIds.includes(m.id))));
        return true;
    }

    public AddNode(nodeType : BTNodeType, pos : XYPosition)
    {
        switch (nodeType)
        {
            case BTNodeType.Root:
                //Impossible
                break;
            case BTNodeType.Selector:
                this._setNodes((nds) => nds.concat(this.CreateSelectorNode(pos)))
                break;
            case BTNodeType.Sequence:
                this._setNodes((nds) => nds.concat(this.CreateSequenceNode(pos)))
                break;
            case BTNodeType.SimpleParallel:
                this._setNodes((nds) => nds.concat(this.CreateParallel(pos)))
                break;
            case BTNodeType.Task:
                this._setNodes((nds) => nds.concat(this.CreateTaskNode(pos)))
                break;
        }
    }


    ///
    private CreateEdge(connection : Connection) : Edge
    {
        return {id: generateUniqueID(), source: connection.source!, target: connection.target!};
    }

    private CreateSelectorNode(pos: XYPosition) : BTNode
    {
        let result : BTNode = {
            id: generateUniqueID(),
            type: "bt_selector",
            data: {
            },
            position: pos
        }
        return result;
    }

    private CreateSequenceNode(pos: XYPosition) : BTNode
    {
        let result : BTNode = {
            id: generateUniqueID(),
            type: "bt_sequence",
            data :{
            },
            position: pos
        }
        return result;
    }

    private CreateParallel(pos: XYPosition) : BTNode
    {
        let result : BTNode = {
            id: generateUniqueID(),
            type: "bt_simpleParallel",
            data:{

            },
            position: pos
        }
        return result;
    }

    private CreateTaskNode(pos: XYPosition) : BTNode
    {
        let result : BTNode = {
            id: generateUniqueID(),
            type: "bt_task",
            data: {

            },
            position: pos
        }
        return result;
    }


    public SaveBehaviourTree()
    {

        //BehaviourTreeModel.Instance.QueryAllBehaviourTrees().then((c) => {console.log(`Ack:  ${JSON.stringify(c)}`)});
        let content = {
            timestamp : Date.now()
        }

        BehaviourTreeModel.Instance.RequestSaveBehaviourTree(`Assets/AI/BtTest_${Date.now()}`, content)
            .then((c) => {console.log(`Ack:  ${JSON.stringify(c)}`)});
    }

    public ReadBehaviourTree()
    {
    }
}


