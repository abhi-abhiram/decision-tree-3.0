import {
  ChevronDoubleRightIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
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
import useWorkspaceStore from "~/store/workspace";
import AddTree from "~/components/workspace/AddTree";
import AddFolder from "~/components/workspace/AddFolder";

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

  const [selected, setSelected] = React.useState<string[]>([]);
  const { data } = api.workspace.foldersAndTrees.useQuery(
    {
      workspaceId: router.query.id as string,
    },
    {
      enabled: !!router.query.id,
    }
  );
  const { data: workspaceData } = api.workspace.getWorkspace.useQuery(
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

  React.useEffect(() => {
    if (workspaceData) {
      setWorksapce(workspaceData);
    }
  }, [workspaceData]);

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
                  {workspace.name && (
                    <h1 className="text-2xl font-medium">{workspace.name}</h1>
                  )}
                  {!workspace.name && (
                    <div className="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
                  )}
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
                  <AddTree />
                  <AddFolder />
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
    </Layout>
  );
}

const Folder = ({
  id,
  name,
  created,
  updated,
  indent = 0,
  onContextMenu,
}: {
  id: string;
  name: string;
  created: Date;
  updated: Date;
  indent?: number;
  onContextMenu?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
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
        onContextMenu={onContextMenu}
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
  const { setSelected } = useWorkspaceStore((state) => ({
    setSelected: state.setSelected,
    selected: state.selected,
  }));
  const [contextMenu, setContextMenuShowing] = React.useState({
    isShowing: false,
    x: 0,
    y: 0,
  });

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
              onContextMenu={(e) => {
                e.preventDefault();
                setContextMenuShowing({
                  isShowing: true,
                  x: e.clientX,
                  y: e.clientY,
                });
                setSelected({
                  id: val.id,
                  type: "folder",
                });
              }}
            />
          ) : (
            <File
              created={val.createdAt}
              updated={val.updatedAt}
              name={val.name}
              id={val.id}
              key={val.id}
              indent={indent}
              onContextMenu={(e) => {
                e.preventDefault();
                setContextMenuShowing({
                  isShowing: true,
                  x: e.clientX,
                  y: e.clientY,
                });
                setSelected({
                  id: val.id,
                  type: "tree",
                });
              }}
            />
          )}
        </React.Fragment>
      ))}
      <ContextMenu
        isShowing={contextMenu.isShowing}
        clientX={contextMenu.x}
        clientY={contextMenu.y}
        setShowing={(isShowing) => {
          setContextMenuShowing({ ...contextMenu, isShowing });
        }}
      />
    </>
  );
};

const File = ({
  id,
  name,
  created,
  updated,
  indent = 0,
  onContextMenu,
}: {
  id: string;
  name: string;
  created: Date;
  updated: Date;
  indent?: number;
  onContextMenu?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) => {
  const { setSelected, selected } = useWorkspaceStore((state) => ({
    setSelected: state.setSelected,
    selected: state.selected,
  }));

  return (
    <div
      className={cn(
        "group flex flex-row items-center rounded-md  py-2 font-medium transition-colors duration-200 ease-in-out odd:bg-gray-200 odd:bg-opacity-60",
        selected?.id === id &&
          "bg-blue-500 text-white odd:bg-blue-500 odd:bg-opacity-100"
      )}
      onClick={() => {
        setSelected({
          id: id,
          type: "tree",
        });

        if (selected?.id === id) {
          setSelected(null);
        }
      }}
      onContextMenu={onContextMenu}
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
          <div className="h-4 w-4"></div>
          <DocumentIcon className="h-4 w-4" />
        </div>
        <p>{name}</p>
      </div>
      <div className="grow px-4">{moment(created).format("MM/DD/YYYY")}</div>
      <div className="grow px-4">{moment(updated).format("MM/DD/YYYY")}</div>
    </div>
  );
};

// import { prisma } from "~/server/db";
// import { appRouter } from "~/server/api/root";
// import { createServerSideHelpers } from "@trpc/react-query/server";
// import superjson from "superjson";
// import { type GetServerSideProps } from "next";

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const ssg = createServerSideHelpers({
//     router: appRouter,
//     ctx: { prisma },
//     transformer: superjson,
//   });

//   const workspaceId = ctx.query.id as string;

//   await ssg.workspace.getWorkspace.prefetch({ workspaceId });

//   return {
//     props: {
//       trpcState: ssg.dehydrate(),
//     },
//   };
// };
