import { create } from "zustand"

export type INodeSelect = {
    treeid: string | null;
    setTreeid: (treeid: string | null) => void;
    addNodeShowing: boolean;
    setAddNodeShowing: (addNodeShowing: boolean) => void;
}

const useNodeSelectStore = create<INodeSelect>((set) => ({
    treeid: null,
    setTreeid: (treeid) => set({ treeid }),
    addNodeShowing: false,
    setAddNodeShowing: (addNodeShowing) => set({ addNodeShowing }),
}));

export default useNodeSelectStore;