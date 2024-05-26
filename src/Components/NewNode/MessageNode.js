import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import "./mssgStyle.css";

const Node = ({ data, selected }) => {
  return (
    <div className="text-updater-node">
      <div
        className="selected__node"
        style={
          selected
            ? {
                boxShadow:
                  "0 1rem 1.75rem rgba(0,0,0,0.25), 0 0.8rem 0.8rem rgba(0,0,0,0.22)",
              }
            : {}
        }
      >
        <div className="selected__node__heading">{data.heading}</div>
        <div className="selected__node__content">{data.content}</div>
      </div>
      <Handle type="source" position={Position.Right} id="b" />
      <Handle type="target" position={Position.Left} id="a" />
    </div>
  );
};

export default memo(Node);
