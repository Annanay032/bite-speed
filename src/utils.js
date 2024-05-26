import { MarkerType } from "reactflow";

export function areAllNodesConnected(nodes, edges) {
  console.log(nodes, edges, "is");
  const allNodesIds = nodes.map((node) => node.id);
  const allSourceEdges = edges.map((edge) => edge.source);
  let count = 0;
  for (let i = 0; i < allNodesIds.length; i++) {
    if (!allSourceEdges.includes(allNodesIds[i])) count++;
  }
  console.log(allNodesIds, allSourceEdges);
  if (count >= 2) {
    return false;
  }
  return true;
}

export const nodes = [
  {
    id: "1",
    type: "node",
    data: { heading: "Send Message", content: "Default text 1" },
    position: { x: 40, y: 220 }
  },
  {
    id: "2",
    type: "node",
    data: { heading: "Send Message", content: "Default text 2" },
    position: { x: 400, y: 120 }
  }
];

export const edges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    markerEnd: {
      type: MarkerType.ArrowClosed
    }
  }
];
