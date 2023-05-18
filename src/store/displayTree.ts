import { createStore } from "zustand"
import { type Node } from "@prisma/client"


export type IDisplayTree = {
    nodes: Node[];
    setNodes: (nodes: Node[]) => void;
}

