import React from "react";
import ReactFlow, {
  type OnNodesChange,
  type Edge,
  type Node,
  applyNodeChanges,
  Background,
  BackgroundVariant,
} from "reactflow";
import ModelNode, { type ModelNodeData } from "./ModelNode";
import RelationEdge from "./RelationEdge";

const nodeTypes = {
  model: ModelNode,
};

const edgeTypes = {
  relation: RelationEdge,
};

const FlowView = ({ data }: FlowViewProps) => {
  const [nodes, setNodes] = React.useState<Node<ModelNodeData>[]>(data.nodes);
  const [edges, setEdges] = React.useState<Edge[]>(data.edges);

  const onNodesChange: OnNodesChange = React.useCallback(
    (changes) => setNodes((nodes) => applyNodeChanges(changes, nodes)),
    [setNodes]
  );

  React.useEffect(() => {
    setNodes(data.nodes);
    setEdges(data.edges);
  }, [data.edges, data.nodes]);

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
      ></ReactFlow>
    </>
  );
};

export interface FlowViewProps {
  data: {
    nodes: Node<ModelNodeData>[];
    edges: Edge[];
  };
}

export default FlowView;
