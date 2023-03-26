import React, { use, useEffect, useState } from "react";
import ReactFlow, {
  Controls,
  Background,
  OnNodesChange,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  EdgeTypes,
  Node as ReactFlowNode,
  useReactFlow,
  SelectionMode,
} from "reactflow";
import CustomEdge, { ConnectionEdge } from "./Edge";
import { getTreeLayout, TextUpdaterNode } from "./Node";
import { Node as CustomNode } from "@prisma/client";
import { shallow } from "zustand/shallow";
import useStore, { RFState } from "./store";
import { cn } from "~/utils";

const nodes: CustomNode[] = [
  {
    id: "1",
    name: "Eve",
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    treeId: "1",
  },
  {
    id: "2",
    name: "Cain",
    parentId: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
    treeId: "1",
  },
  {
    id: "3",
    name: "Seth",
    parentId: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
    treeId: "1",
  },
  {
    id: "4",
    name: "Enos",
    parentId: "3",
    createdAt: new Date(),
    updatedAt: new Date(),
    treeId: "1",
  },
  {
    id: "5",
    name: "Noam",
    parentId: "3",
    createdAt: new Date(),
    updatedAt: new Date(),
    treeId: "1",
  },
  {
    id: "6",
    name: "Abel",
    parentId: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
    treeId: "1",
  },
  {
    id: "7",
    name: "Awan",
    parentId: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
    treeId: "1",
  },
  {
    id: "8",
    name: "Enoch",
    parentId: "7",
    createdAt: new Date(),
    updatedAt: new Date(),
    treeId: "1",
  },
  {
    id: "9",
    name: "Azura",
    parentId: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
    treeId: "1",
  },
];

const [initialNodes, initialEdges] = getTreeLayout(nodes);

const nodeTypes = { textUpdater: TextUpdaterNode };

const edgeTypes: EdgeTypes = {
  default: CustomEdge,
};

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export default function DisplayTree() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useStore(
    selector,
    shallow
  );

  const [selectedNode, setSelectedNode] =
    React.useState<ReactFlowNode<CustomNode> | null>(null);
  const { setViewport, setCenter, zoomTo } = useReactFlow();

  const [minZoom, setMinZoom] = useState<number | undefined>(4);

  useEffect(() => {
    zoomTo(1, {
      duration: 800,
    });

    setMinZoom(undefined);
  });

  return (
    <div className="h-full">
      <ReactFlow
        className="bg-gray-50"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionLineComponent={ConnectionEdge}
        fitView
        selectionMode={SelectionMode.Full}
        onNodeClick={(e, node) => {}}
        minZoom={minZoom}
        maxZoom={10}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
