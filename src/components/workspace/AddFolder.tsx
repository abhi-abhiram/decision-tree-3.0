import { FolderPlusIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import useWorkspaceStore from "~/store/workspace";
import { api } from "~/utils/api";
import { Button } from "../ui/Button";
import Modal from "../ui/Modal";
import { Textinput } from "../ui/Textinput";
import React from "react";

const AddFolder = () => {
  const { mutateAsync, isLoading } = api.folder.create.useMutation();
  const [name, setName] = React.useState("");
  const router = useRouter();
  const initialFocusRef = React.useRef<HTMLInputElement>(null);
  const { selected } = useWorkspaceStore((state) => ({
    selected: state.selected,
  }));
  const [isShowing, setIsShowing] = React.useState(false);
  const utils = api.useContext();

  return (
    <>
      <button
        className="rounded-md p-1 text-gray-500 hover:bg-gray-200 hover:bg-opacity-70 hover:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50
        "
        onClick={() => {
          setIsShowing(true);
        }}
        disabled={selected?.type === "tree"}
      >
        <FolderPlusIcon className="h-5 w-5" />
      </button>
      <Modal
        title="Create Folder"
        isOpen={isShowing}
        setIsOpen={() => setIsShowing(false)}
        initialFocus={initialFocusRef}
      >
        <form
          onSubmit={(e) => {
            const handler = async () => {
              e.preventDefault();
              const parentId = selected?.id ?? undefined;
              await mutateAsync({
                name,
                workspaceId: router.query.id as string,
                parentId,
              });
              setName("");
              void utils.workspace.foldersAndTrees.invalidate({
                workspaceId: router.query.id as string,
              });
              setIsShowing(false);
            };

            void handler();
          }}
        >
          <div className="my-1">
            <Textinput
              placeholder="Folder Name"
              ref={initialFocusRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-1">
            <Button type="submit" isloading={isLoading}>
              Create
            </Button>
            <Button
              type="button"
              onClick={() => setIsShowing(false)}
              variant="secondary"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddFolder;
