import { create } from "zustand";
import { type RouterOutputs } from "~/utils/api";

type Node = RouterOutputs['tree']['getRootNode'];

export type Answer = {
    nodeId: string;
    nodeName: string;
    answer: string;
    question: string;
    multipleChoiceOption?: string;
}


export type DisplayTreeStore = {
    answers: Map<string, Answer>;
    nodes: Node[];
    setNodes: (nodes: Node[]) => void;
    addNode: (node: Node) => void;
    addAnswer: (answer: Answer) => void;
    updateAnswer: (answer: Answer) => void;
    deleteAnswer: (answer: Answer) => void;
    currentNodeIndex: number;
    setCurrentNodeIndex: (index: number) => void;
};



export const useDisplayTreeStore = create<DisplayTreeStore>((set, get) => ({
    answers: new Map(),
    currentNodeIndex: 0,
    addAnswer: (answer) => {
        const answers = get().answers;
        answers.set(answer.nodeId, answer);
        set({ answers: new Map(answers) });
    },
    updateAnswer: (answer) => {
        const answers = get().answers;
        answers.set(answer.nodeId, answer);
        set({ answers: new Map(answers) });
    },
    deleteAnswer: (answer) => {
        const answers = get().answers;
        answers.delete(answer.nodeId);
        set({ answers: new Map(answers) });
    },
    setNodes: (nodes) => {
        set({ nodes });
    },
    nodes: [],
    addNode: (node) => {
        const nodes = get().nodes;
        set({ nodes: [...nodes, node] });
    }
    ,
    setCurrentNodeIndex: (index) => {
        set({ currentNodeIndex: index });
    }
}));
