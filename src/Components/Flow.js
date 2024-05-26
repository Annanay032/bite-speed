import React, { useCallback, useEffect, useState, useRef } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  Background,
} from "reactflow";
import { ToastContainer, toast } from "react-toastify";

// Components
import Sidebar from "./SideBar/Sidebar";
import Node from "./NewNode/MessageNode";

// Utils
import { areAllNodesConnected,  nodes as defaultNodes, edges as defaultEdges } from "../utils";
// Styles
import "reactflow/dist/style.css";
import 'react-toastify/dist/ReactToastify.css';
import "./mainContainer.css";

const FlowContainer = () => {
  const flowWrapper = useRef(null); // Reference to the flow wrapper
  const textRef = useRef(null); // Reference to the text input
  const [idCounter, setIdCounter] = useState((JSON.parse(sessionStorage.getItem("nodes")) || defaultNodes)?.length - 2); // Counter for generating unique node IDs
  const [flowInstance, setFlowInstance] = useState(null); // Instance of ReactFlow

  // State for nodes and edges, initialized from session storage or default values
  const [nodes, setNodes, onNodesChange] = useNodesState(
    JSON.parse(sessionStorage.getItem("nodes")) || defaultNodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    JSON.parse(sessionStorage.getItem("edges")) || defaultEdges
  );

  const [selectedNode, setSelectedNode] = useState(null); // Currently selected node
  const [isNodeSelected, setIsNodeSelected] = useState(false); // Flag to check if a node is selected
  const [nodeContent, setNodeContent] = useState(
    sessionStorage.getItem("nodeContent") || "Node 1"
  ); // Content of the currently selected node

  // Effect to handle node selection
  useEffect(() => {
    const selected = nodes.find((node) => node.selected);
    if (selected) {
      setSelectedNode(selected);
      setIsNodeSelected(true);
    } else {
      setSelectedNode(null);
      setIsNodeSelected(false);
    }
  }, [nodes]);

  // Effect to set node content and focus input when a node is selected
  useEffect(() => {
    if (selectedNode) {
      setNodeContent(selectedNode.data?.content || selectedNode.id);
      if (textRef.current) {
        textRef.current.focus();
      }
    }
  }, [selectedNode]);

  // Effect to update nodes with new content
  useEffect(() => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === selectedNode?.id) {
          node.data = { ...node.data, content: nodeContent || " " };
        }
        return node;
      })
    );
  }, [nodeContent, selectedNode, setNodes]);

  // Handler for initializing the ReactFlow instance
  const onInitHandler = useCallback((instance) => setFlowInstance(instance), []);

  // Handler for drag over event
  const handleDrag = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Handler for drop event
  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      const flowBounds = flowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");
      const label = event.dataTransfer.getData("content");

      const position = flowInstance.project({
        x: event.clientX - flowBounds.left,
        y: event.clientY - flowBounds.top,
      });

      // Generate a new unique ID for the node
      const newId = () => {
         const id = idCounter
        setIdCounter((prev) => prev + 1);
        return `node_${id + 1}`;
      };

      const newNode = {
        id: newId(),
        type,
        position,
        data: { heading: "Send Message", content: label },
      };

      setNodes((prevNodes) => [...prevNodes, newNode]);
      setSelectedNode(newNode.id);
    },
    [flowWrapper, flowInstance, idCounter]
  );

  // Handler for connecting nodes
  const handleConnect = useCallback(
    (params) =>
      setEdges((prevEdges) =>
        addEdge({ ...params, markerEnd: { type: "arrowclosed" } }, prevEdges)
      ),
    [setEdges]
  );

  // Handler for the save button
  const handleOnSave = useCallback(() => {
    if (areAllNodesConnected(nodes, edges)) {
      sessionStorage.setItem("nodes", JSON.stringify(nodes));
        sessionStorage.setItem("edges", JSON.stringify(edges));
        sessionStorage.setItem("nodeContent", nodeContent);
      toast.success("Success, Your Changes are saved!");
    } else {
      toast.error("Please connect all source nodes (Cannot save flow).");
    }
  }, [nodes, edges, nodeContent]);

  return (
    <>
      <div className="save-div">
        <button className="save-button" onClick={handleOnSave}>
          Save Changes
        </button>
      </div>
      <div className="main-flow-container">
        <ReactFlowProvider>
          <div className="reactflow-container" ref={flowWrapper}>
            <ReactFlow
              attributionPosition="top-right"
              edges={edges}
              nodes={nodes}
              onInit={onInitHandler}
              nodeTypes={{ node: Node }}
              onEdgesChange={onEdgesChange}
              onNodesChange={onNodesChange}
              onConnect={handleConnect}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Background color="#aaa" gap={16} />
            </ReactFlow>
          </div>
          <Sidebar
            isNodeSelected={isNodeSelected}
            textRef={textRef}
            nodeName={nodeContent}
            setNodeName={setNodeContent}
          />
        </ReactFlowProvider>
      </div>
      <ToastContainer position="top-center"/>
    </>
  );
};

export default FlowContainer;
