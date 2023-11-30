import React, { useState, useEffect } from "react";
import "./styles.css";
import Menu from "./management/menu";
import TreeView from "./management/treeView";
import { TreeContext } from "./start-screen.js";
import Editor from "./Editor";
import Start from "./start-screen";

export default function App() {
  const [showEditor, setShowEditor] = useState(false);

  const handleNewFolderClick = () => {
    setShowEditor(true);

  };
  
  return (
    //The current attempt to transfer data revolves around context
    <TreeContext.Provider>
      <div className="App">
        <div className="top-menu-bar">
          <div className="Icon"></div>
        </div>
        <Menu/>
        <TreeContext.Consumer>
          {(value) => {
            <TreeView tree_data={value}/>
          }}   
        </TreeContext.Consumer>
        {showEditor ? (
          <Editor/>
        ) : (
          <Start onClickNewFolder={handleNewFolderClick} />
        )}
      </div>
    </TreeContext.Provider>
  );
}
