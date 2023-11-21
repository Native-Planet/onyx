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
        <h2>Hello Modal</h2>
        <p>
          testing works
        </p>
        <button className="close-modal" onClick={toggleModal}>
          CLOSE
        </button>
      </div>
    </div>
  )}
  </>
    );
}

export default App;