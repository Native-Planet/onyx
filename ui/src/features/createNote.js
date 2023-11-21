import React, { useState } from "react";
import memoize from "lodash/memoize";
//import Urbit from "@urbit/http-api";
import "../styles.css";


function App(){

    const api = {
        createApi: memoize(() => {
            const urb = new Urbit("http://localhost:8080", "lidlut-tabwed-pillex-ridrup");
            urb.ship = "zod";
            urb.onError = (message) => console.log("onError: ", message);
            urb.onOpen = () => console.log("urbit onOpen");
            urb.onRetry = () => console.log("urbit onRetry");
            urb.connect();
            return urb;
        }),
        createFolder: async () => {
            return api.createApi().poke({
              app: "onyx",
              mark: "create-note",
              path: "/somefolder", //change depending on the folder this is note is being created
              //json: JSON.stringify(editorState), how to save the editorState after retrieving it from the lexical editor. Jacks task;
            });
          },
    }
        const handleClick = () => {
          // Handle button click logic here
          console.log('Button clicked!');
        }
       

    return (
        
        <button onClick={handleClick} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <i className="add-note" title="Create a New Note"/>
        </button>
    );
}

export default App;