import {ReactComponent as FileIcon} from "./tree_icons/Insert template.svg";
import {ReactComponent as FolderIcon} from "./tree_icons/ic_round-folder.svg";
import {ReactComponent as ArrowDown} from "./tree_icons/down.svg";
import {ReactComponent as ArrowRight} from "./tree_icons/right.svg";

const Node = ({node, style, dragHandle, tree}) => {
    
    return (
        <div className="node-container" style={style} ref={dragHandle}>
            <div className="node-content" onClick={() => {
                    if(node.isInternal) { node.toggle(); }
                    else { openFile(); }}
                }>
                {node.isLeaf ? (
                    <>
                        <span className="arrow"></span>
                        <span className="file-folder-icon">
                            <FileIcon className="file-icon"/>
                        </span>
                    </>
                ) : (
                    <>
                        <span className="arrow">
                            {node.isOpen ? <ArrowDown className="arrow-down"/> : <ArrowRight className="arrow-right"/>}
                        </span>
                        <span className="file-folder-icon">
                            <FolderIcon className="folder-icon" />
                        </span>
                    </>
                )}
                <span className="node-text">
                    {node.isEditing ? (
                        <input
                        type="text"
                        defaultValue={node.data.name}
                        onFocus={(e) => e.currentTarget.select()}
                        onBlur={() => node.reset()}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") node.reset();
                            if (e.key === "Enter") node.submit(e.currentTarget.value);
                        }}
                        autoFocus
                        />
                    ) : (
                        <span>{node.data.name}</span>
                    )}
                </span>
            </div>
        </div>
    );
};

const openFile = () => {
    console.log("File opening functionality coming soon!");
};

export default Node;