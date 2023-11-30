import React, { useState } from "react";
import "../styles.css";
import Create from "../features/createFolder";
import Note from "../features/createNote"
import Settings from "../features/settings";
import Help from "../features/help";
import Save from "../features/save";
import Upload from "../features/upload";
function App(){


    return (
        
        <div className="menu-management">
            <Create/>
            <Note/>
            <Save/>
            <Upload/>
            <Settings/>
            <Help/>
        </div>
    );
}

export default App;