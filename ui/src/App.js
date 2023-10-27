import React, { useState } from "react";
import "./styles.css";
import Folders from "./folderManagement";
import Notes from "./noteManagement";
import Editor from "./Editor";
import Start from "./start-screen";

export default function App() {
  const [showEditor, setShowEditor] = useState(false);


  const handleNewFolderClick = () => {
    setShowEditor(true);

  };


  
  return (
    <div className="App">
      <Folders/>
      <Notes/>
      {showEditor ? (
        <Editor/>
      ) : (
        <Start onClickNewFolder={handleNewFolderClick} />
      )}
    </div>
  );
}
