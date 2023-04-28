import {
  ChevronDoubleRightIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Button } from "~/components/ui/Button";
import { Dropdown, MenuGroup, MenuItem } from "~/components/ui/Dropdown";
import Layout from "~/components/ui/Layout";
import { Main } from "~/components/ui/Main";
import { cn } from "~/utils";
import { Nav } from "../..";
import Link from "next/link";
import Modal from "~/components/ui/Model";
import { Textinput } from "~/components/ui/Textinput";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  FolderIcon,
  FolderOpenIcon,
} from "@heroicons/react/20/solid";
import { ContextMenu } from "~/components/ui/ContextMenu";
import { api } from "~/utils/api";
import moment from "moment";
import { Folder, type Tree } from "@prisma/client";
import useModal from "~/hooks/useModal";
import useWorkspaceStore from "~/store/workspace";

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
  const [contextMenu, setContextMenuShowing] = React.useState({
    isShowing: false,
    x: 0,
    y: 0,
  });
  const [selected, setSelected] = React.useState<string[]>([]);
  const { data } = api.workspace.foldersAndTrees.useQuery(
    {
      workspaceId: router.query.id as string,
    },
    {
      enabled: !!router.query.id,
    }
  );

  const { workspace, setWorksapce } = useWorkspaceStore((state) => ({
    workspace: state.workspace,
    setWorksapce: state.setWorkspace,
  }));

  useEffect(() => {
    if (data?.workspace) {
      setWorksapce(data.workspace);
    }
  }, [data]);

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
                {workspace?.name}
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
                  <h1 className="text-2xl font-medium">{workspace?.name}</h1>
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
              <div className="flex justify-between border-b border-gray-200 py-2">
                <div></div>
                <div className="flex self-end">
                  <Add />
                </div>
              </div>
              <div className="sticky top-0 flex flex-row items-center py-3  text-xs font-medium text-gray-500 [&>*]:px-3">
                <div className="w-1/2">Name</div>
                <div className="grow">Created</div>
                <div className="grow">Updated</div>
              </div>
            </div>

            <div className="flex flex-1 flex-col overflow-auto text-left text-xs text-gray-900 ">
              <Folders data={data?.foldersAndTrees ?? []} />
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
      <ContextMenu
        isShowing={contextMenu.isShowing}
        clientX={contextMenu.x}
        clientY={contextMenu.y}
        setShowing={(isShowing) => {
          setContextMenuShowing({ ...contextMenu, isShowing });
        }}
      />
    </Layout>
  );
}

const Folder = ({
  id,
  name,
  created,
  updated,
  indent = 0,
}: {
  id: string;
  name: string;
  created: Date;
  updated: Date;
  indent?: number;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const data = api.folder.open.useQuery(
    { id },
    {
      enabled: isOpen,
    }
  );
  const { setSelected, selected } = useWorkspaceStore((state) => ({
    setSelected: state.setSelected,
    selected: state.selected,
  }));

  return (
    <>
      <div
        className={cn(
          "group flex flex-row items-center rounded-md  py-2 font-medium transition-colors duration-200 ease-in-out odd:bg-gray-200 odd:bg-opacity-60",
          selected?.id === id &&
            "bg-blue-500 text-white odd:bg-blue-500 odd:bg-opacity-100"
        )}
        onDoubleClick={() => setIsOpen(!isOpen)}
        onClick={() => {
          setSelected({
            id: id,
            type: "folder",
          });

          if (selected?.id === id) {
            setSelected(null);
          }
        }}
      >
        <div
          className={cn("flex w-1/2 items-center gap-1")}
          style={
            indent > 0
              ? {
                  paddingLeft: `${indent * 1.25}rem`,
                }
              : {}
          }
        >
          <div
            className={cn(
              "flex gap-1 pl-2 text-gray-500",
              selected?.id === id && "text-white"
            )}
          >
            {isOpen ? (
              <>
                <ChevronDownIcon
                  className="h-4 w-4"
                  onClick={() => {
                    setIsOpen(!isOpen);
                  }}
                />
                <FolderOpenIcon className="h-4 w-4" />
              </>
            ) : (
              <>
                <ChevronRightIcon
                  className="h-4 w-4"
                  onClick={() => {
                    setIsOpen(!isOpen);
                  }}
                />
                <FolderIcon className="h-4 w-4" />
              </>
            )}
          </div>
          <p>{name}</p>
        </div>
        <div className="grow px-4">{moment(created).format("MM/DD/YYYY")}</div>
        <div className="grow px-4">{moment(updated).format("MM/DD/YYYY")}</div>
      </div>
      {isOpen && <Folders data={data.data ?? []} indent={indent + 1} />}
    </>
  );
};

const Folders = ({
  data,
  indent = 0,
}: {
  data: (Folder | Tree)[];
  indent?: number;
}) => {
  const { setSelected, selected } = useWorkspaceStore((state) => ({
    setSelected: state.setSelected,
    selected: state.selected,
  }));

  return (
    <>
      {data?.map((val) => (
        <React.Fragment key={val.id}>
          {"parentId" in val ? (
            <Folder
              id={val.id}
              name={val.name}
              created={val.createdAt}
              updated={val.updatedAt}
              key={val.id}
              indent={indent}
            />
          ) : (
            <div
              className={cn(
                "group flex cursor-pointer flex-row items-center rounded-md py-2 font-medium transition-colors duration-200 ease-in-out odd:bg-gray-200 odd:bg-opacity-60"
              )}
              key={val.id}
              // onContextMenu={(e) => {
              //   e.preventDefault();
              //   setContextMenuShowing({
              //     isShowing: true,
              //     x: e.clientX,
              //     y: e.clientY,
              //   });
              // }}
              onClick={() => {
                setSelected({
                  id: val.id,
                  type: "tree",
                });
              }}
            >
              <div
                className="flex w-1/2 items-center gap-1 pl-7"
                style={
                  indent > 0
                    ? {
                        paddingLeft: `${indent * 1.5}rem`,
                      }
                    : {}
                }
              >
                <DocumentIcon className="h-4 w-4 text-gray-500" />
                <p>{val.name}</p>
              </div>
              <div className="grow px-4">
                {moment(val.createdAt).format("MM/DD/YYYY")}
              </div>
              <div className="grow px-4">
                {moment(val.updatedAt).format("MM/DD/YYYY")}
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

const AddFolder = ({ onClose }: { onClose: () => void }) => {
  const { mutateAsync, isLoading } = api.folder.create.useMutation();
  const [name, setName] = React.useState("");
  const router = useRouter();
  const initialFocusRef = React.useRef<HTMLInputElement>(null);
  const { selected } = useWorkspaceStore((state) => ({
    selected: state.selected,
  }));

  return (
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
          onClose();
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
        <Button type="button" onClick={() => onClose()} variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
};

const AddTree = ({ onClose }: { onClose: () => void }) => {
  const { mutateAsync, isLoading } = api.tree.create.useMutation();
  const [name, setName] = React.useState("");
  const router = useRouter();
  const initialFocusRef = React.useRef<HTMLInputElement>(null);
  const { selected } = useWorkspaceStore((state) => ({
    selected: state.selected,
  }));

  return (
    <form
      onSubmit={(e) => {
        const handler = async () => {
          e.preventDefault();

          await mutateAsync({
            name,
            workspaceId: router.query.id as string,
            folderId: selected?.type === "folder" ? selected.id : undefined,
          });
          onClose();
        };

        void handler();
      }}
    >
      <div className="my-1">
        <Textinput
          placeholder="Tree Name"
          ref={initialFocusRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex justify-end space-x-1">
        <Button type="submit" isloading={isLoading}>
          Create
        </Button>
        <Button type="button" onClick={() => onClose()} variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
};

const Add = () => {
  const [modal, setModal] = useModal();

  return (
    <>
      <Dropdown
        button={
          <button className="rounded-md p-1 text-gray-500 hover:bg-gray-200 hover:bg-opacity-70 hover:text-gray-500">
            <EllipsisHorizontalIcon className="h-5 w-5" />
          </button>
        }
        className="right-0 z-10 w-36"
      >
        <MenuGroup>
          <MenuItem
            onClick={() => {
              setModal("Create Folder", (close) => (
                <AddFolder onClose={close} />
              ));
            }}
          >
            {() => (
              <>
                <span>Create Folder</span>
              </>
            )}
          </MenuItem>
          <MenuItem
            onClick={() => {
              setModal("Create Tree", (close) => <AddTree onClose={close} />);
            }}
          >
            {() => <span>Create Tree</span>}
          </MenuItem>
        </MenuGroup>
      </Dropdown>
      {modal}
    </>
  );
};
