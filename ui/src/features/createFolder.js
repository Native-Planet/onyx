import React, { useState } from "react";
import "../styles.css";

function App(){
    const handleIconClick = () => {
        // Define the function you want to execute when the icon is clicked.
        console.log('Icon clicked!');
      };

    return (
        
        <i onClick={handleIconClick} className="add-folder" title="Create Folder"/>
    );
}

export default App;