import React from "react";

import EditMessage from "../../Components/SideBar/EditMessage";
import { MssgIcon } from "../Icons/mssgIcon";

export default ({ isNodeSelected, textRef, nodeName, setNodeName }) => {
  const onDragStart = (event, nodeType, content) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.setData("content", content);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside>
      {isNodeSelected ? (
        <EditMessage
          textRef={textRef}
          nodeName={nodeName}
          setNodeName={setNodeName}
        />
      ) : (
        <div
          className="node input"
          onDragStart={(event) => onDragStart(event, "node", "message")}
          draggable
        >
         <MssgIcon/>
          Message
        </div>
      )}
    </aside>
  );
};
