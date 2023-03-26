import { create } from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  Node as ReactFlowNode,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
// import { getTreeLayout } from "./Node";
import { Node as CustomNode } from "@prisma/client";
import { createId } from "@paralleldrive/cuid2";
import * as d3 from "d3-hierarchy";

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

export type RFState = {
  nodes: typeof initialNodes;
  edges: typeof initialEdges;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addNode: (parentNode: CustomNode) => void;
  onConnect: OnConnect;
};

const useStore = create<RFState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  addNode: (parentNode: CustomNode) => {
    const newNode: CustomNode = {
      id: createId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      name: parentNode.name + "'s child",
      parentId: parentNode.id,
      treeId: parentNode.treeId,
    };

    const oldNodes: CustomNode[] = get().nodes.map((node) => {
      if (node.id === parentNode.id) node.data.updatedAt = new Date();

      return {
        ...node.data,
      };
    });

    const [newNodes, newEdges] = getTreeLayout([...oldNodes, newNode]);

    set({
      nodes: newNodes,
      edges: newEdges,
    });
  },
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
}));

export default useStore;

export function getTreeLayout<
  T extends { id: string; parentId: string | null }
>(nodes: T[]): [ReactFlowNode<T>[], Edge<T>[]] {
  const resultNodes: ReactFlowNode<T>[] = [];

  const resultEdges: Edge<T>[] = [];

  var root = d3
    .stratify<(typeof nodes)[number]>()
    .id(function (d) {
      return d.id;
    })
    .parentId(function (d) {
      return d.parentId;
    })(nodes);

  d3.tree<(typeof nodes)[number]>()
    .nodeSize([100, 350])
    .separation(function (a, b) {
      return a.parent == b.parent ? 1 : 1;
    })(root)
    .each((node) => {
      const x = node.x;
      node.x = node.y;
      node.y = x;

      resultNodes.push({
        id: node.data.id,
        type: "textUpdater",
        position: { x: node.x, y: node.y },
        data: node.data,
        draggable: false,
        focusable: true,
      });

      resultEdges.push({
        id: `${node.parent?.id}-${node.id}`,
        source: node.parent?.id ?? "",
        target: node.id ?? "",
        data: node.data,
      });
    });

  return [resultNodes, resultEdges];
}
