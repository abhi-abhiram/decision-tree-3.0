import { type Variable, } from "@prisma/client";
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
    animationReverse: boolean;
    setAnimationReverse: (reverse: boolean) => void;
    variables: Map<string, {
        name: string;
        value: string;
    }>;
    setVariable: (data: Variable, value: string) => void;
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
    },
    setCurrentNodeIndex: (index) => {
        set({ currentNodeIndex: index });
    },
    animationReverse: false,
    setAnimationReverse: (reverse) => {
        set({ animationReverse: reverse });
    },
    variables: new Map(),
    setVariable: (data, value) => {
        const variables = get().variables;
        if (data.operator === "Replace") {
            variables.set(data.id, { name: data.name, value });
        } else if (data.operator === "Append") {
            const variable = variables.get(data.id);
            if (variable) {
                variable.value += value;
                variables.set(data.id, variable);
            } else {
                variables.set(data.id, { name: data.name, value });
            }
        }

        set({ variables: new Map(variables) });
    }

}));
