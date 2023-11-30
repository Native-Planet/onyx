import React, { useState } from "react";
import memoize from "lodash/memoize";
//import Urbit from "@urbit/http-api";
import "../styles.css";

function App(){
    
    const handleClick = () => {
        console.log("upload clicked");
      };
    return (
        
        <button onClick={handleClick} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <i className="upload" title="Note Loaded"/>
        </button>

   
    );
}

export default App;