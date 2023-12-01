import React, { useState } from "react";
import memoize from "lodash/memoize";
//import Urbit from "@urbit/http-api";
import "../styles.css";

function App(){
    const [modal, setModal] = useState(false);
    const toggleModal = () => {
        setModal(!modal)
      };

    return (
        <>
        <button onClick={toggleModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <i className="help" title="Help Menu"/>
        </button>

    {modal && (
    <div className="modal">
      <div onClick={toggleModal} className="overlay"></div>
      <div className="modal-content">
        <h2>Help</h2>
        {/* <p>
          Plugins:
          <ul>
            <li>
              <a href="https://lexical.dev/" target="_blank" rel="noopener noreferrer">
                https://lexical.dev/
              </a>
            </li>
          </ul>
        </p> */}
        <p>Keyboard shortcuts:</p>
        <button className="close-modal" onClick={toggleModal}>
          X
        </button>
      </div>
    </div>
  )}
  </>
    );
}

export default App;