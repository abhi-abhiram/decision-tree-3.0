import { cn } from "~/utils";
import React from "react";
import { Transition } from "@headlessui/react";
import { useOnClickOutside } from "~/utils/hooks";
import useWorkspaceStore from "~/store/workspace";
import { useRouter } from "next/router";
import { Button } from "./Button";
import Modal from "./Modal";
import { api } from "~/utils/api";

const ContextListItem = ({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <li
      className={cn(
        "cursor-pointer rounded-md px-3 py-1 text-sm text-gray-700 transition-colors duration-150 ease-in-out hover:bg-blue-500 hover:text-white",
        className
      )}
      onClick={onClick}
    >
      {children}
    </li>
  );
};

const ContextList = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <ul className={cn("space-y-1 p-1", className)}>{children}</ul>;
};

const Break = () => {
  return <div className="border-t border-gray-200"></div>;
};

export const ContextMenu = ({
  isShowing,
  clientX,
  clientY,
  setShowing,
}: {
  isShowing: boolean;
  clientX: number;
  clientY: number;
  setShowing: (showing: boolean) => void;
}) => {
  const menuref = React.useRef<HTMLDivElement>(null);
  const { push, asPath } = useRouter();
  const { selected } = useWorkspaceStore((state) => ({
    setSelected: state.setSelected,
    selected: state.selected,
  }));
  const [showDelete, setShowDelete] = React.useState(false);

  useOnClickOutside(menuref, () => {
    setShowing(false);
  });

  return (
    <>
      <Transition show={isShowing}>
        <div
          className={cn(
            "absolute left-0 mt-2 w-56 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          )}
          style={{ top: clientY, left: clientX }}
          ref={menuref}
        >
          <ContextList>
            <ContextListItem
              onClick={() => {
                if (!selected || selected.type !== "tree") return;
                void push(`/tree/${selected.id}`);
              }}
            >
              Open
            </ContextListItem>
            <ContextListItem
              onClick={() => {
                if (!selected || selected.type !== "tree") return;
                window.open(`/tree/${selected.id}`, "_blank", "noreferrer");
              }}
            >
              Open in new tab
            </ContextListItem>
            <ContextListItem
              onClick={() => {
                if (!selected || selected.type !== "tree") return;
                void push(`${asPath}/${selected.id}`);
              }}
            >
              Edit
            </ContextListItem>
            <Break />
            <ContextListItem>Rename</ContextListItem>
            <Break />
            <ContextListItem onClick={() => setShowDelete(true)}>
              Delete
            </ContextListItem>
          </ContextList>
        </div>
      </Transition>
      <Delete isOpen={showDelete} onClose={() => setShowDelete(false)} />
    </>
  );
};

function Delete({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const { selected } = useWorkspaceStore((state) => ({
    setSelected: state.setSelected,
    selected: state.selected,
  }));
  const deleteTree = api.tree.delete.useMutation();
  const deleteFolder = api.folder.delete.useMutation();
  const utils = api.useContext();

  return (
    <Modal
      title="Delete"
      isOpen={isOpen}
      setIsOpen={onClose}
      initialFocus={cancelRef}
    >
      <div className="mt-2 flex flex-col gap-2">
        <p>
          Are you sure you want to delete this{" "}
          {selected?.type === "tree" ? "Tree" : "Folder"}?
        </p>
        <div className="flex justify-end gap-2">
          <Button
            className="bg-red-600 text-white hover:bg-red-500"
            onClick={() => {
              async function deleteTreeOrFolder() {
                if (selected)
                  if (selected.type === "tree") {
                    await deleteTree.mutateAsync({ id: selected.id });
                  } else {
                    await deleteFolder.mutateAsync({ id: selected.id });
                  }
                await utils.workspace.foldersAndTrees.invalidate();
                onClose();
              }
              void deleteTreeOrFolder();
            }}
            isloading={deleteTree.isLoading || deleteFolder.isLoading}
          >
            Delete
          </Button>
          <Button
            variant="secondary"
            onClick={onClose}
            ref={cancelRef}
            className="focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
