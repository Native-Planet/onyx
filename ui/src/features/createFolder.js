import React, { useState } from "react";
import memoize from "lodash/memoize";
import Urbit from '@urbit/http-api';
import "../styles.css";

function App() {
  const [folderName, setFolderName] = useState("");
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleFolderNameChange = (event) => {
    setFolderName(event.target.value);
  };

  const api = {
    createApi: memoize(() => {
      const urb = new Urbit("http://localhost:8080", "lidlut-tabwed-pillex-ridrup");
      urb.ship = "zod";
      urb.onOpen = () => console.log("urbit onOpen");
      urb.onRetry = () => console.log("urbit onRetry");
      urb.connect();
      return urb;
    }),
    createFolder: async () => {
        //code below cause error because of the syntax on in the path field
        return api.createApi().poke({
        app: "bedrock",
        mark: "db-action",
        json: {
          "create-path": {
            "path": "/" + folderName, 
            "peers": [
              {"ship": "~zod", "role": "host"}
            ]
          }
        }
      });
    },
    
  };

  return (
    <>
      <button onClick={toggleModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
        <i className="add-folder" title="Create Folder" />
      </button>

      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <h2>Folder Name</h2>
            <input type="text" value={folderName} onChange={handleFolderNameChange} />
            <button className="close-modal" onClick={toggleModal}>
              CLOSE
            </button>
            <button className="createFolder-button" onClick={api.createFolder}>
              Create Folder
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
