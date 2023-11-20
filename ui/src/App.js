import React, { useState } from "react";
import "./styles.css";
import Menu from "./management/menu";
import TreeView from "./management/treeView";
import Editor from "./Editor";
import Start from "./start-screen";

export default function App() {
  const [showEditor, setShowEditor] = useState(false);


  const handleNewFolderClick = () => {
    setShowEditor(true);

  };


  
  return (
    <div className="App">
      <div className="top-menu-bar">
        <div className="Icon"></div>
      </div>
      <Menu/>
      <TreeView/>
      {showEditor ? (
        <Editor/>
      ) : (
        <Start onClickNewFolder={handleNewFolderClick} />
      )}
    </div>
  );
}
