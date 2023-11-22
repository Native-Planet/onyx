import React, { useState } from "react";
import { Tree } from "react-arborist";
import { sample_data } from "./sample_data.js";
import Node from "./Node";
import "../styles.css";



function App(){


    return (
        
        <div className="treeView-management">
            <Tree className="main-tree" 
                initialData={sample_data} 
                height={500}
                indent={15}
                rowHeight={35}
                openByDefault={false}
            >
                {Node}
            </Tree>
        </div>
    );
}

export default App;