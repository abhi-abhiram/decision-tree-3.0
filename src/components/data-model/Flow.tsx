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
import _ from "lodash";
import { api } from "~/utils/api";

const nodeTypes = {
  model: ModelNode,
};

const edgeTypes = {
  relation: RelationEdge,
};

const FlowView = ({ data }: FlowViewProps) => {
  const [nodes, setNodes] = React.useState<Node<ModelNodeData>[]>(data.nodes);
  const [edges, setEdges] = React.useState<Edge[]>(data.edges);
  const { mutate: updatePositionMutation } =
    api.model.updatePosition.useMutation();

  const updatePosition = React.useCallback(
    _.debounce((node: { id: string; position: { x: number; y: number } }) => {
      updatePositionMutation({
        id: node.id,
        positionX: node.position.x,
        positionY: node.position.y,
      });
    }, 1000),
    []
  );

  const onNodesChange: OnNodesChange = React.useCallback(
    (changes) => {
      const node = changes[0];
      if (node && node.type === "position" && node.position) {
        updatePosition({
          id: node.id,
          position: node.position,
        });
      }
      setNodes((nodes) => applyNodeChanges(changes, nodes));
    },
    [updatePosition]
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
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={2}
          color="currentColor"
          className="text-gray-500"
        />
      </ReactFlow>
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
