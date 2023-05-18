import { Button } from "~/ui/Button";
import Modal from "../ui/Modal";
import React from "react";
import { cn } from "~/utils";
import Tabs from "../ui/Tabs";
import { Tab } from "@headlessui/react";
import { options } from "~/pages/workspace/[id]/[treeId]";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  DocumentIcon,
  FolderIcon,
  FolderOpenIcon,
} from "@heroicons/react/20/solid";
import { api } from "~/utils/api";
import { Folder, type Tree } from "@prisma/client";
import Select from "../ui/Select";
import useNodeSelectStore from "~/store/nodeSelect";
import { Input } from "../ui/Input";
import useStore from "./store";
import Loader from "../ui/Loader";

export default function AddNodeModal() {
  const { addNodeShowing, setAddNodeShowing } = useNodeSelectStore(
    ({ addNodeShowing, setAddNodeShowing }) => ({
      addNodeShowing,
      setAddNodeShowing,
    })
  );
  const { addNode, tree, selectedNode } = useStore((state) => ({
    addNode: state.addNode,
    tree: state.tree,
    selectedNode: state.selectedNode,
  }));
  const [name, setName] = React.useState("");
  const { mutateAsync: addNodeMutation, isLoading } =
    api.node.create.useMutation({
      onSuccess(data) {
        addNode(data);
        setAddNodeShowing(false);
        setName("");
      },
    });

  return (
    <Modal
      className="max-w-4xl rounded-md"
      isOpen={addNodeShowing}
      setIsOpen={() => setAddNodeShowing(false)}
      position="top"
    >
      <Tabs tabs={["Native Nodes", "Custom Nodes"]}>
        <Tab.Panel className={cn("relative bg-white p-3")}>
          {isLoading && (
            <div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-white bg-opacity-50">
              <Loader className="h-8 w-8" />
            </div>
          )}
          <div className="p-3">
            <div className="flex flex-col gap-1">
              <Input
                placeholder="Enter a name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {options.map((val, index) => (
                <div
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-100 px-3 py-2 transition-colors duration-200 ease-in-out hover:bg-gray-100"
                  key={index}
                  onClick={() => {
                    if (tree && selectedNode) {
                      void addNodeMutation({
                        name,
                        type: val.value,
                        treeId: tree?.id,
                        parentId: selectedNode?.id,
                        question: "",
                      });
                    }
                  }}
                >
                  <span>{val.icon}</span>
                  <span>{val.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Tab.Panel>
        <Tab.Panel className={cn("bg-white p-3")}>
          <Tab2 />
        </Tab.Panel>
      </Tabs>
    </Modal>
  );
}

const Tab2 = () => {
  const [selectedWorkspace, setSelectedWorkspace] = React.useState<
    string | null
  >(null);
  const worksapces = api.workspace.workspaces.useQuery();
  const { addNode, tree, selectedNode } = useStore((state) => ({
    addNode: state.addNode,
    tree: state.tree,
    selectedNode: state.selectedNode,
  }));
  const { data } = api.workspace.foldersAndTrees.useQuery(
    {
      workspaceId: selectedWorkspace as string,
    },
    {
      enabled: !!selectedWorkspace,
    }
  );
  const {
    tree: selected,
    setTree,
    setAddNodeShowing,
  } = useNodeSelectStore(({ setTree, tree, setAddNodeShowing }) => ({
    tree,
    setTree,
    setAddNodeShowing,
  }));
  const { mutateAsync: createBridge, isLoading } =
    api.bridge.createBridgeNode.useMutation({
      onSuccess(data) {
        addNode(data);
        setTree({ id: data.id, name: data.name });
        setAddNodeShowing(false);
      },
    });

  return (
    <div className="flex h-96 flex-col gap-2">
      <div className="w-1/2 ">
        <Select
          options={
            worksapces.data?.map((val) => ({
              value: val.id,
              label: val.name,
            })) ?? []
          }
          selected={selectedWorkspace}
          setSelected={setSelectedWorkspace}
          placeholder="Select a workspace"
          listboxClass="p-2"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 overflow-y-auto text-sm">
        <Folders data={data?.foldersAndTrees ?? []} />
      </div>
      <div className="flex items-center justify-center">
        <Button
          onClick={() => {
            if (tree && selectedNode && selected) {
              void createBridge({
                fromTreeId: tree.id,
                toTreeId: selected.id,
                name: selected.name,
                parentId: selectedNode.id,
              });
            }
          }}
          disabled={!selected}
          isloading={isLoading}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

const Folders = ({
  data,
  indent = 0,
}: {
  data: (Folder | Tree)[];
  indent?: number;
}) => {
  return (
    <>
      {data?.map((val) => (
        <React.Fragment key={val.id}>
          {"parentId" in val ? (
            <Folder id={val.id} name={val.name} key={val.id} indent={indent} />
          ) : (
            <File name={val.name} id={val.id} key={val.id} indent={indent} />
          )}
        </React.Fragment>
      ))}
    </>
  );
};

const Folder = ({
  id,
  name,
  indent = 0,
}: {
  id: string;
  name: string;
  indent?: number;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const data = api.folder.open.useQuery(
    { id },
    {
      enabled: isOpen,
    }
  );

  return (
    <>
      <div
        className={cn(
          "group flex flex-row items-center rounded-md  py-2 font-medium transition-colors duration-200 ease-in-out odd:bg-gray-200 odd:bg-opacity-60"
        )}
        onDoubleClick={() => setIsOpen(!isOpen)}
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
          <div className={cn("flex gap-1 pl-2 text-gray-500")}>
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
      </div>
      {isOpen && <Folders data={data.data ?? []} indent={indent + 1} />}
    </>
  );
};

const File = ({
  id,
  name,
  indent = 0,
  onContextMenu,
}: {
  id: string;
  name: string;
  indent?: number;
  onContextMenu?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) => {
  const { setTree: setSelected, tree: selected } = useNodeSelectStore(
    ({ setTree, tree }) => ({ tree, setTree })
  );

  return (
    <div
      className={cn(
        "group flex flex-row items-center rounded-md py-2 font-medium transition-colors duration-200 ease-in-out odd:bg-gray-200 odd:bg-opacity-60",
        selected?.id === id &&
          "bg-blue-500 text-white odd:bg-blue-500 odd:bg-opacity-100"
      )}
      onClick={() => {
        setSelected({
          id,
          name,
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
    </div>
  );
};
