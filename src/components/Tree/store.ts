import { create } from "zustand";
import {
  type Connection,
  type Edge,
  type EdgeChange,
  type Node as ReactFlowNode,
  type NodeChange,
  addEdge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import { type Tree, type Node as CustomNode } from "@prisma/client";
import * as d3 from "d3-hierarchy";


const initialNodes: CustomNode[] = [
  {
    id: "1",
    name: "Node 1",
    parentId: null,
    type: "Date",
    createdAt: new Date(),
    updatedAt: new Date(),
    question: "What is your name?",
    treeId: "1",
  }, {
    id: "2",
    name: "Node 2",
    parentId: "1",
    type: "Date",
    createdAt: new Date(),
    updatedAt: new Date(),
    question: "What is your name?",
    treeId: "1",
  }, {
    id: "3",
    name: "Node 3",
    parentId: "1",
    type: "Date",
    createdAt: new Date(),
    updatedAt: new Date(),
    question: "What is your name?",
    treeId: "1",
  }, {
    id: "4",
    name: "Node 4",
    parentId: "2",
    type: "Date",
    createdAt: new Date(),
    updatedAt: new Date(),
    question: "What is your name?",
    treeId: "1",
  }
];

const [testNode, testEdge] = getTreeLayout(initialNodes);


export type RFState = {
  tree: Tree | null,
  nodes: ReactFlowNode<CustomNode>[];
  edges: Edge[];
  selectedNode: ReactFlowNode<CustomNode> | null;
  d3Tree: d3.HierarchyPointNode<CustomNode> | null;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  addNode: (newNode: CustomNode) => void;
  setNodesAndEdges: (nodes: CustomNode[]) => void;
  onConnect: OnConnect;
  deleteNode: (nodeId: string) => void;
  editNode: (editNode: CustomNode) => void;
  setTree: (tree: Tree) => void;
  setSelectedNode: (node: ReactFlowNode<CustomNode>) => void;
};

const useStore = create<RFState>((set, get) => ({
  tree: null,
  nodes: testNode,
  edges: testEdge,
  selectedNode: null,
  d3Tree: null,
  addNode: (newNode: CustomNode) => {

    const oldNodes: CustomNode[] = get().nodes.map((node) => {
      return {
        ...node.data,
      };
    });

    const [newNodes, newEdges, tree] = getTreeLayout([...oldNodes, newNode]);

    set({
      nodes: newNodes,
      edges: newEdges,
      d3Tree: tree,
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

  setNodesAndEdges(nodes) {
    const [newNodes, newEdges, tree] = getTreeLayout(nodes);

    set({
      nodes: newNodes,
      edges: newEdges,
      d3Tree: tree,
    });
  },

  deleteNode(nodeId) {
    const oldNodes = get().nodes.map((node) => {

      return {
        ...node.data,
      };
    });

    const [newNodes, newEdges, tree] = getTreeLayout(oldNodes.filter((node) => node.id !== nodeId));

    set({
      nodes: newNodes,
      edges: newEdges,
      d3Tree: tree,
    });
  },

  editNode(editNode) {
    const node = get().nodes.find((node) => node.id === editNode.id);

    if (node) {
      node.data = editNode;
    }

    set({
      nodes: [...get().nodes],
    });
  },

  setTree(tree) {
    set({
      tree: tree,
    });
  },

  setSelectedNode(node) {
    set({
      selectedNode: node,
    });
  }

}));

export default useStore;

export function getTreeLayout<
  T extends { id: string; parentId: string | null }
>(nodes: T[]): [ReactFlowNode<T>[], Edge[], d3.HierarchyPointNode<T>] {
  const resultNodes: ReactFlowNode<T>[] = [];

  const resultEdges: Edge[] = [];

  const root = d3
    .stratify<(typeof nodes)[number]>()
    .id(function (d) {
      return d.id;
    })
    .parentId(function (d) {
      return d.parentId;
    })(nodes);

  const tree = d3.tree<(typeof nodes)[number]>()
    .nodeSize([150, 400])
    .separation(function (a, b) {
      return a.parent == b.parent ? 1 : 1;
    })(root);

  tree.each((node) => {
    const x = node.x;
    node.x = node.y;
    node.y = x;

    resultNodes.push({
      id: node.data.id,
      position: { x: node.x, y: node.y },
      data: node.data,
      draggable: false,
      focusable: true,
      type: "node"
    });

    if (!node.parent?.id || !node.id) return;

    resultEdges.push({
      id: `${node.parent?.id}-${node.id}`,
      source: node.parent?.id ?? "",
      target: node.id ?? "",
    });
  });


  return [resultNodes, resultEdges, tree];
}
