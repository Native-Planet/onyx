import React, { useState } from "react";
import "./styles.css";
import Create from "./features/createFolder";
import Open from "./features/openFolder";
import Settings from "./features/settings";
import Help from "./features/help";

function App(){


    return (
        
        <div className="folder-management">
            <Create/>
            <Open/>
            <Settings/>
            <Help/>
        </div>
    );
}

export default App;