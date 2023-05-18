import { create } from "zustand"

export type INodeSelect = {
    tree: { id: string, name: string } | null;
    setTree: (tree: INodeSelect['tree']) => void;
    addNodeShowing: boolean;
    setAddNodeShowing: (addNodeShowing: boolean) => void;
}

const useNodeSelectStore = create<INodeSelect>((set) => ({
    tree: null,
    setTree: (tree) => set({ tree }),
    addNodeShowing: false,
    setAddNodeShowing: (addNodeShowing) => set({ addNodeShowing }),
}));

export default useNodeSelectStore;