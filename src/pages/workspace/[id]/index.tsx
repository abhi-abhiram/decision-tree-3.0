import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ChevronDoubleRightIcon } from "@heroicons/react/20/solid";
import { PlusIcon } from "@heroicons/react/24/solid";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "~/components/ui/Button";
import { Dropdown, MenuGroup, MenuItem } from "~/components/ui/Dropdown";
import Layout from "~/components/ui/Layout";
import { Main } from "~/components/ui/Main";
import { cn } from "~/utils";
import { Nav } from "../..";
import Link from "next/link";
import Modal from "~/components/ui/Model";
import { Textinput } from "~/components/ui/Textinput";

const data = [
  {
    name: "Tree 1",
    created: "2021-01-01",
    updated: "2021-01-01",
  },
  {
    name: "Tree 2",
    created: "2021-01-01",
    updated: "2021-01-01",
  },
  {
    name: "Tree 3",
    created: "2021-01-01",
    updated: "2021-01-01",
  },
];

function CreateWorkspace() {
  const [isOpen, setIsOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      <Button className="shadow-md" size="sm" onClick={() => setIsOpen(true)}>
        <PlusIcon className="mr-2 h-5 w-5" />
        Create Tree
      </Button>
      <Modal
        title="Create Workspace"
        isOpen={isOpen}
        setIsOpen={() => setIsOpen(false)}
        initialFocus={inputRef}
      >
        <div className="mt-2 flex flex-col gap-2">
          <Textinput ref={inputRef} />
          <div className="flex justify-end gap-2">
            <Button>Create</Button>
            <Button
              variant="secondary"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function DeleteWorkspace({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Modal
      title="Delete Workspace"
      isOpen={isOpen}
      setIsOpen={onClose}
      initialFocus={cancelRef}
    >
      <div className="mt-2 flex flex-col gap-2">
        <p>Are you sure you want to delete this workspace?</p>
        <div className="flex justify-end gap-2">
          <Button className="bg-red-600 text-white hover:bg-red-500">
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

function RenameWorkspace({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <Modal
      title="Rename Workspace"
      isOpen={isOpen}
      setIsOpen={onClose}
      initialFocus={inputRef}
    >
      <div className="mt-2 flex flex-col gap-2">
        <Textinput ref={inputRef} />
        <div className="flex justify-end gap-2">
          <Button>Rename</Button>
          <Button
            variant="secondary"
            onClick={() => {
              onClose();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default function Workspace() {
  const router = useRouter();
  const [navShowing, setNavShowing] = React.useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [rename, setRename] = React.useState(false);

  return (
    <Layout>
      <header className="w-screen border border-gray-200 bg-white">
        <div className="flex h-10 items-center justify-between px-3">
          <div className="flex items-center">
            <button
              className={cn(
                "rounded-md p-1 text-gray-400 transition-opacity duration-200 ease-in-out hover:bg-gray-200 hover:text-gray-500 hover:shadow-sm",
                navShowing ? "pointer-events-none opacity-0" : "opacity-100"
              )}
              onClick={() => {
                setNavShowing(!navShowing);
              }}
            >
              <ChevronDoubleRightIcon className="h-5 w-5" />
            </button>
            <div className="ml-2 text-left text-gray-600">
              Workspace /{" "}
              <Link
                href="/workspace/[id]"
                as="/workspace/1"
                className="
                text-blue-500
                hover:underline
              "
              >
                Workspace Name
              </Link>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <Nav isShowing={navShowing} setIsShowing={setNavShowing} />
        <Main>
          <div className="flex h-full flex-col">
            <div className="sticky top-0">
              <div>
                <div className="flex items-center gap-1">
                  <h1 className="text-2xl font-medium">workspace name</h1>
                  <Dropdown
                    button={
                      <button className="rounded-md p-1 text-gray-500 hover:bg-gray-200 hover:bg-opacity-70 hover:text-gray-500">
                        <EllipsisHorizontalIcon className="h-5 w-5" />
                      </button>
                    }
                    className="z-10 w-24"
                  >
                    <MenuGroup>
                      <MenuItem>
                        {({ active, close, disabled }) => (
                          <>
                            <span>Copy Link</span>
                          </>
                        )}
                      </MenuItem>
                      <MenuItem onClick={() => setRename(true)}>
                        {({ active, close, disabled }) => <span>Rename</span>}
                      </MenuItem>
                    </MenuGroup>
                    <MenuGroup>
                      <MenuItem
                        className="text-red-600 ui-active:bg-red-600"
                        onClick={() => {
                          setDeleteModalOpen(true);
                        }}
                      >
                        {({ active, close, disabled }) => <span>Delete</span>}
                      </MenuItem>
                    </MenuGroup>
                  </Dropdown>
                </div>
              </div>
              <div className="flex justify-between border-b border-gray-200 py-6">
                <CreateWorkspace />
                <div className="flex">
                  <Button>Button</Button>
                  <Button>Button</Button>
                </div>
              </div>
              <div className="sticky top-0 flex flex-row items-center py-3  text-sm font-medium text-gray-500 [&>*]:px-3">
                <div className="w-1/2">Name</div>
                <div className="grow">Created</div>
                <div className="grow">Updated</div>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-2 overflow-auto text-left text-sm text-gray-900">
              {data.map((item) => (
                <div
                  className="group flex cursor-pointer flex-row items-center rounded-xl bg-gray-200 bg-opacity-50 py-3 font-medium shadow-sm transition-colors
                  duration-200 ease-in-out hover:bg-gray-300 hover:bg-opacity-60 [&>*]:px-3
                  "
                  key={item.name}
                >
                  <div className="relative w-1/2">
                    {item.name}
                    <div className="invisible absolute top-1/2 right-0 flex -translate-y-1/2 gap-1 group-hover:visible">
                      <button
                        className="rounded-md p-1 text-blue-600 transition-transform duration-200 ease-in-out hover:scale-110
                        hover:bg-blue-100 hover:shadow-sm 
                        "
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button className="hover:text-red- rounded-md p-1 text-red-600 transition-transform duration-200 ease-in-out hover:scale-110 hover:bg-red-100 hover:shadow-sm">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="grow">{item.created}</div>
                  <div className="grow">{item.updated}</div>
                </div>
              ))}
            </div>
          </div>
        </Main>
      </div>
      <DeleteWorkspace
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
        }}
      />
      <RenameWorkspace
        isOpen={rename}
        onClose={() => {
          setRename(false);
        }}
      />
    </Layout>
  );
}
