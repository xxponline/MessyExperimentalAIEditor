import {EditorFrameworkView} from "./views/EditorFrameworkView";
import {EditorFrameworkViewModel} from "./viewmodels/EditorFrameworkViewModel";


function App() {
    return (
        <EditorFrameworkViewModel render={EditorFrameworkView}/>
        //<BehaviourTreeEditorView/>
    );
}
export default App;
