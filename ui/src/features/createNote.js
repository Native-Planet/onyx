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
    createNote: async () => {
        //code below cause error because of the syntax on in the path field
        return api.createApi().poke({
        app: "db",
        mark: "db-action",
        json: {
            "create": {
                "path":"/testytest",
                "data": ['{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}'],
            }
        }
      });
    },
    
  };

  return (
    <>
      <button onClick={toggleModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
        <i className="add-note" title="Create Note" />
      </button>

      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <h2>Note Name</h2>
            <input type="text" value={folderName} onChange={handleFolderNameChange} />
            <button className="close-modal" onClick={toggleModal}>
              CLOSE
            </button>
            <button className="createFolder-button" onClick={api.createNote}>
              Create Note
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
