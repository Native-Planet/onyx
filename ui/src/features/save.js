import React, { useRef } from 'react';
import memoize from "lodash/memoize";
//import Urbit from "@urbit/http-api";
import { LexicalComposer, LexicalRichTextPlugin, LexicalOnChangePlugin } from 'lexical';
import "../styles.css";

function App(){
    
    const handleClick = () => {
        const editorStateRef = useRef();
        console.log("button clicked");
      };
    return (
        
        <button onClick={handleClick} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <i className="save" title="Save Progress"/>
        </button>

   
    );
}

export default App;