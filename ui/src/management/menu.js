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
            <div className="top-icons">
                <Create/>
                <Note/>
                <Save/>
            </div>
            <div className="bottom-icons">
                <Upload/>
                <Settings/>
                <Help/>
            </div>
        </div>
    );
}

export default App;