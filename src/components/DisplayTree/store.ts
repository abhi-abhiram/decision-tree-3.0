import { create } from "zustand";
import { type RouterOutputs } from "~/utils/api"

export type Answer = {
    nodeId: string;
    nodeName: string;
    answer: string;
    question: string;
}

export type DisplayTreeStore = {
    tree: RouterOutputs['tree']['onlyTree'] | null,
    setTree: (tree: DisplayTreeStore['tree']) => void;
    answers: Answer[];
    setAnswers: (answer: Answer) => void;
    nodes: Exclude<RouterOutputs['node']['get'], null>[];
    addNode: (node: DisplayTreeStore['nodes'][number]) => void;
};


export const useDisplayTreeStore = create<DisplayTreeStore>((set, get) => ({
    tree: null,
    setTree: (tree) => {
        const rootNode = tree?.rootNode;
        const nodes = get().nodes;
        if (rootNode && nodes.length === 0) {
            set({ nodes: [...nodes, rootNode] });
        }
        set({ tree })
    },
    answers: [],
    setAnswers: (answer) => {
        const oldAnswers = get().answers;
        set({ answers: [...oldAnswers, answer] });
    },
    nodes: [],
    addNode: (node) => {
        const nodes = get().nodes;
        set({ nodes: [...nodes, node] });
    }
}));
