import React from "react";
import "./styles.css";
import {useState} from "react";

export const TreeContext = React.createContext();

function Start({ onClickNewFolder }) {

  /*The idea of open folder is: 
    -> use context menu to get a folder handle
    -> use folder handle to populate the initial data for the tree
    -> transfer the initial data to treeView.js
    ...the difficulty is that you can't directly modify a file for the initial data,
    and you can't export the data with "export" because it needs to be dynamically updated,
    so the current idea is to use states with react context ->
  */
  const [tree_data, setTreeData] = useState({ data: [] });
  const temp_data = { data: [] };

  async function openUserFolder() {
    //Open the UI to select a folder and get its handle
    let folderHandle = await window.showDirectoryPicker();
    let index = 1;
    //The folder's representation in the tree_data file
    const folderObj = 
    {
      id: index.toString(),
      name: folderHandle.name,
      children: []
    };
    temp_data.data.push(folderObj);
    //-> However, this breaks the code ->
    setTreeData(tree_data => [...tree_data, folderObj]);
    for await (const fileF of folderHandle.values()) {
      index++;
      //At the moment, we skip over folders and just read files
      /*A recursive method might be do-able to include folders of folders, but
        you need to use indexes to keep track of each folder, and you can't dynamically
        add indexes to an array statement */
      if(fileF.kind === "file") {
        temp_data.data[0].children.push(
          {
            id: index.toString(),
            name: fileF.name
          }
        );
      }
    }
    //-> and this doesn't actually do anything
    setTreeData(temp_data);
    console.log(tree_data);
  }

  return (
    <TreeContext.Provider value={{ tree_data, setTreeData}}>
      <div className="start-screen">
        <div className="inner-start-screen">
          <h1>No File is Open</h1>
          <div class="button-container">
            <button className="newFolderButton" onClick={onClickNewFolder}>
                Create a new File
              </button>
              <button className="gotoFileButton" onClick={openUserFolder}>
                Open folder
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
    </TreeContext.Provider>
  );
}

export default Start;
