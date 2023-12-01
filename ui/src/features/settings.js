import React, { useState } from "react";
import { useEffect } from "react";
import memoize from "lodash/memoize";
//import Urbit from "@urbit/http-api";
import "../styles.css";

function App() {
  const [modal, setModal] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(
    localStorage.getItem("selectedTheme") === "dark"
  );

  const toggleModal = () => {
    setModal(!modal);
  };
  
  const setDarkMode = () => {
    document.querySelector("body").setAttribute('data-theme', 'dark')
    localStorage.setItem("selectedTheme", "dark");
  }
  const setLightMode = () => {
    document.querySelector("body").setAttribute('data-theme', 'light')
    localStorage.setItem("selectedTheme", "light");
  }
  
  const selectedTheme = localStorage.getItem("selectedTheme");

  if (selectedTheme === "dark") {
    setDarkMode();
  }
  else if (selectedTheme === "light") {
    setLightMode();
  }

  const toggleTheme = (e) => {
    if (e.target.checked) setDarkMode();
    else setLightMode();
  }

  if (selectedTheme==="dark")
    setDarkMode();

  return (
    <>
      <button
        onClick={toggleModal}
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        <i className="settings" title="Open Settings" />
      </button>

      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <h2>Settings</h2>
            <label className="theme-toggle">
              Dark theme:
              <input
                type="checkbox"
                onChange={toggleTheme}
                defaultChecked={selectedTheme === "dark"}
              />
            </label>
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
