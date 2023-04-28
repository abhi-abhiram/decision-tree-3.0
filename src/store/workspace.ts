import { create } from "zustand";

export type IWorksapce = {
    workspace: { id: string, name: string };
    setWorkspace: (workspace: { id: string, name: string }) => void;
    selected: { id: string, type: "folder" | "tree" } | null;
    setSelected: (selected: { id: string, type: "folder" | "tree" } | null) => void;
};

const useWorkspaceStore = create<IWorksapce>((set) => ({
    workspace: { id: "", name: "" },
    setWorkspace: (workspace) => set({ workspace }),
    selected: null,
    setSelected: (selected) => set({ selected }),
}));

export default useWorkspaceStore;