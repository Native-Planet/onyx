import React, { useState } from "react";
import { Tree } from "react-arborist";
import {TreeContext} from "../start-screen.js";
import Node from "./Node";
import "../styles.css";

function App(){

    const { tree_data } = useContext(TreeContext);
    return (
        
        <div className="treeView-management">
            <Tree className="main-tree" 
                //This property defines what the tree is built from
                initialData={tree_data.data} 
                height={500}
                indent={15}
                rowHeight={35}
                //Whether or not folders are opened when the view loads
                openByDefault={false}
            >
                {Node}
            </Tree>
        </div>
    );
}

export default App;