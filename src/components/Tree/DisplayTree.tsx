import React from "react";
import ReactFlow, {
  Background,
  type EdgeTypes,
  type Node as ReactFlowNode,
  useReactFlow,
  SelectionMode,
} from "reactflow";
import CustomEdge, { ConnectionEdge } from "./Edge";
import { TextUpdaterNode } from "./Node";
import { type Node as CustomNode } from "@prisma/client";
import { shallow } from "zustand/shallow";
import useStore, { type RFState } from "./store";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/20/solid";

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
  const { zoomIn, zoomOut, fitView } = useReactFlow();

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
        selectionMode={SelectionMode.Full}
        fitView
        fitViewOptions={{
          maxZoom: 1,
        }}
      >
        <Background />
        <div className="absolute bottom-3 left-3 z-10 flex  transform rounded-md border border-gray-100 bg-white p-1.5 text-black shadow-sm">
          <button
            onClick={() => {
              zoomIn({
                duration: 200,
              });
            }}
            className="rounded-md p-1 transition-colors duration-200 ease-in-out hover:bg-gray-200"
          >
            <PlusSmallIcon className="h-6 w-6" />
          </button>
          <button
            onClick={() => {
              zoomOut({
                duration: 200,
              });
            }}
            className="rounded-md p-1 transition-colors duration-200 ease-in-out hover:bg-gray-200"
          >
            <MinusSmallIcon className="h-6 w-6" />
          </button>
          <button
            onClick={() => {
              fitView({
                duration: 500,
              });
            }}
            className="rounded-md p-1 transition-colors duration-200 ease-in-out hover:bg-gray-200 "
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
            >
              <path
                d="M4.25 2C3.00736 2 2 3.00736 2 4.25V6.25C2 6.66421 2.33579 7 2.75 7C3.16421 7 3.5 6.66421 3.5 6.25V4.25C3.5 3.83579 3.83579 3.5 4.25 3.5H6.25C6.66421 3.5 7 3.16421 7 2.75C7 2.33579 6.66421 2 6.25 2H4.25Z"
                fill="#0F172A"
              />
              <path
                d="M13.75 2C13.3358 2 13 2.33579 13 2.75C13 3.16421 13.3358 3.5 13.75 3.5H15.75C16.1642 3.5 16.5 3.83579 16.5 4.25V6.25C16.5 6.66421 16.8358 7 17.25 7C17.6642 7 18 6.66421 18 6.25V4.25C18 3.00736 16.9926 2 15.75 2H13.75Z"
                fill="#0F172A"
              />
              <path
                d="M3.5 13.75C3.5 13.3358 3.16421 13 2.75 13C2.33579 13 2 13.3358 2 13.75V15.75C2 16.9926 3.00736 18 4.25 18H6.25C6.66421 18 7 17.6642 7 17.25C7 16.8358 6.66421 16.5 6.25 16.5H4.25C3.83579 16.5 3.5 16.1642 3.5 15.75V13.75Z"
                fill="#0F172A"
              />
              <path
                d="M18 13.75C18 13.3358 17.6642 13 17.25 13C16.8358 13 16.5 13.3358 16.5 13.75V15.75C16.5 16.1642 16.1642 16.5 15.75 16.5H13.75C13.3358 16.5 13 16.8358 13 17.25C13 17.6642 13.3358 18 13.75 18H15.75C16.9926 18 18 16.9926 18 15.75V13.75Z"
                fill="#0F172A"
              />
            </svg>
          </button>
        </div>
      </ReactFlow>
    </div>
  );
}
