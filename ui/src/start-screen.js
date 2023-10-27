import React from "react";
import "./styles.css";

function Start({ onClickNewFolder }) {
  return (
    <div className="start-screen">
      <div className="inner-start-screen">
        <h1>No File Open</h1>
        <button className="newFolderButton" onClick={onClickNewFolder}>
          Create a new Folder
        </button>
      </div>
    </div>
  );
}

export default Start;
