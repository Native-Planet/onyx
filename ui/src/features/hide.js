import React, { useState } from "react";
import "../styles.css";

function App(){
    const [hide, setHide] = useState(false);

    const handleHide = () => {
        
        console.log('Icon clicked!');
      };

    return (
        <i onClick={handleHide} className="hide" title="Hide File and Note Manager"/>
    );
}

export default App;