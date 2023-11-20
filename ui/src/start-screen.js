import React from "react";
import "./styles.css";

function Start({ onClickNewFolder }) {
  return (
    <div className="start-screen">
      <div className="inner-start-screen">
        <h1>No File is Open</h1>
        <div class="button-container">
          <button className="newFolderButton" onClick={onClickNewFolder}>
              Create a new File
            </button>
            <button className="gotoFileButton" onClick={onClickNewFolder}>
              Go to File
            </button>
            <button className="recentButton" onClick={onClickNewFolder}>
              Recent
            </button>
            <button className="closeButton" onClick={onClickNewFolder}>
              Close
            </button>
        </div>
      </div>
    </div>
  );
}

export default Start;
