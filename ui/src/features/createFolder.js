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
              mark: "create-folder",
              path: "/folders", //change depending on the database
              //json: here would be the json to create a folder that would house editorStates(notes);,
            });
          },
    }
    const handleIconClick = () => {
        // Define the function you want to execute when the icon is clicked.
        console.log('Icon clicked!');
      };

    return (
        
        <button onClick={handleIconClick}  style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <i onClick={handleIconClick} className="add-folder" title="Create Folder"/>
        </button>
    );
}

export default App;