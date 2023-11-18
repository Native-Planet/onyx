import React, { useState } from "react";
import "../styles.css";
import Create from "../features/createFolder";
import Note from "../features/createNote"
import Settings from "../features/settings";
import Help from "../features/help";

function App(){


    return (
        
        <div className="menu-management">
            <Create/>
            <Note/>
            <Settings/>
            <Help/>
        </div>
    );
}

export default App;