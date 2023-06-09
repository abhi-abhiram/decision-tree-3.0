import {
  ArrowUpTrayIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronUpIcon,
  LinkIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import Layout from "~/components/ui/Layout";
import { Main } from "~/components/ui/Main";
import "reactflow/dist/style.css";
import DisplayTree from "~/components/TreeEditor/DisplayTree";
import { ReactFlowProvider, useReactFlow } from "reactflow";
import { cn } from "~/utils";
import { Textinput } from "~/components/ui/Textinput";
import useStore from "~/components/TreeEditor/store";
import { shallow } from "zustand/shallow";
import Tabs from "~/components/ui/Tabs";
import { Disclosure, Tab } from "@headlessui/react";
import { Textarea } from "~/components/ui/Textarea";
import _ from "lodash";
import Select from "~/components/ui/Select";
import { Button } from "~/components/ui/Button";
import Modal from "~/components/ui/Modal";
import { api } from "~/utils/api";
import { NodeTypeIcon } from "~/components/TreeEditor/NodeTypeIcon";
import Loader from "~/components/ui/Loader";
import { type UpdateNodeInput } from "~/zodObjs/node";
import { type NodeType, type Node } from "@prisma/client";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "~/server/uploadthing";
import axios from "axios";
import Options from "~/components/Options";
import Nav from "~/components/ui/Nav";
import AddNodeModal from "~/components/TreeEditor/AddNodeModal";
import { Input } from "~/components/ui/Input";

function LeftNav({
  isShowing,
  setIsShowing,
}: {
  isShowing: boolean;
  setIsShowing: (isShowing: boolean) => void;
}) {
  const [query, setQuery] = React.useState("");
  const { nodes, setSelectedNode, selectedNode } = useStore(
    ({ nodes, selectedNode, setSelectedNode }) => ({
      nodes,
      selectedNode,
      setSelectedNode,
    }),
    shallow
  );
  const { setCenter } = useReactFlow();

  const filtereddata = React.useMemo(() => {
    return query === ""
      ? nodes
      : nodes.filter((data) =>
          data.data.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
  }, [query, nodes]);

  return (
    <Nav isShowing={isShowing}>
      <div className="sticky top-0">
        <div className="relative h-10 bg-white">
          <div className={cn("absolute right-0 top-1 block")}>
            <button
              className={cn(
                "rounded-md p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500 hover:shadow-sm"
              )}
              onClick={() => {
                setIsShowing(!isShowing);
              }}
            >
              <ChevronDoubleLeftIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className=" bg-white px-3">
          <Textinput
            leftIcon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
            placeholder="Search"
            className="shadow-lg"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="h-5"></div>
      </div>
      <div className="mb-4 flex flex-col text-gray-600">
        {filtereddata.map((val) => (
          <div
            className={cn(
              "group px-3 py-2 text-gray-900 transition-colors duration-200 ease-in-out hover:bg-gray-200",
              val.id === selectedNode?.id && "bg-gray-200"
            )}
            key={val.id}
            onClick={() => {
              setCenter(val.position.x + 128, val.position.y + 48, {
                duration: 300,
                zoom: 1,
              });

              setSelectedNode(val);
            }}
          >
            <div className="flex h-full flex-1 items-center gap-1 overflow-hidden">
              <NodeTypeIcon type={val.data.type} />
              <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                <span className="text-sm font-medium">{val.data.name}</span>
                {val.data.type !== "BridgeType" && (
                  <div className="flex-1 overflow-hidden text-xs font-light">
                    {_.truncate(val.data.question, {
                      length: 90,
                      separator: /,? +/,
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Nav>
  );
}

export const options: {
  label: string;
  value: NodeType;
  icon: React.ReactNode;
}[] = [
  {
    label: "MultiInput",
    value: "MultiInput",
    icon: <NodeTypeIcon type="MultiInput" />,
  },
  {
    label: "Date",
    value: "Date",
    icon: <NodeTypeIcon type="Date" />,
  },
  {
    value: "MultipleChoice",
    label: "Multiple Choice",
    icon: <NodeTypeIcon type="MultipleChoice" />,
  },
  {
    value: "Number",
    label: "Number",
    icon: <NodeTypeIcon type="Number" />,
  },
  {
    value: "Select",
    label: "Select",
    icon: <NodeTypeIcon type="Select" />,
  },
  {
    value: "SingleInput",
    label: "Single Input",
    icon: <NodeTypeIcon type="SingleInput" />,
  },
];

function RightNav({
  isShowing,
}: {
  isShowing: boolean;
  setIsShowing: (isShowing: boolean) => void;
}) {
  const { selectedNode, editNode } = useStore(
    ({ nodes, selectedNode, editNode }) => ({
      nodes,
      selectedNode,
      editNode,
    })
  );
  const [selected, setSelected] = React.useState<NodeType | null>(
    (selectedNode?.data.type !== "BridgeType"
      ? selectedNode?.data.type
      : null) ?? null
  );
  const router = useRouter();
  const [question, setQuestion] = React.useState<string | null>(null);
  const { mutateAsync: updateNodeMutation } = api.node.update.useMutation();
  const [name, setName] = React.useState<string | null>(null);

  const updateNode = useCallback(
    _.debounce(async (node: UpdateNodeInput, fullNode: Node) => {
      editNode(fullNode);
      await updateNodeMutation(node);
    }, 1000),
    []
  );

  React.useEffect(() => {
    if (selectedNode && selectedNode.data.type !== "BridgeType") {
      setQuestion(selectedNode.data.question);
      setSelected(selectedNode.data.type);
      setName(selectedNode.data.name);
    }
  }, [selectedNode]);

  if (selectedNode?.data.type === "BridgeType") {
    return null;
  }

  return (
    <nav
      className={cn(
        "relative scale-x-100 scroll-m-1 scroll-p-1 overflow-y-auto border-l border-gray-200 bg-white duration-200 ease-in-out",
        isShowing ? "w-72" : "w-0 overflow-hidden p-0"
      )}
    >
      <Tabs tabs={["Question", "Logic"]}>
        <Tab.Panel className={cn("bg-white p-3")}>
          <div>
            <label className="block text-sm font-medium leading-10 text-gray-900">
              Name
            </label>
            <div>
              <Input
                value={name ?? ""}
                placeholder="Enter Name"
                onChange={(event) => {
                  setName(event.target.value);

                  if (selectedNode && selectedNode.data.type !== "BridgeType") {
                    selectedNode.data.name = event.target.value;
                    void updateNode(
                      {
                        id: selectedNode?.id ?? "",
                        name: event.target.value,
                      },
                      selectedNode.data
                    );
                  }
                }}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium leading-10 text-gray-900">
              Question
            </label>
            <div>
              <Textarea
                className="rounded-md shadow-sm"
                rows={3}
                placeholder="Enter your question here?"
                value={question ?? ""}
                onChange={(event) => {
                  setQuestion(event.target.value);

                  if (selectedNode && selectedNode.data.type !== "BridgeType") {
                    selectedNode.data.question = event.target.value;
                    void updateNode(
                      {
                        id: selectedNode?.id ?? "",
                        question: event.target.value,
                      },
                      selectedNode.data
                    );
                  }
                }}
              />
            </div>
          </div>
          <div className="mt-2">
            <label className="block text-sm font-medium leading-10 text-gray-900">
              Type
            </label>
            <Select
              options={options}
              selected={selected ?? null}
              setSelected={(val) => {
                if (selectedNode && selectedNode.data.type !== "BridgeType") {
                  selectedNode.data.type = val;
                  void updateNode(
                    {
                      id: selectedNode?.id ?? "",
                      type: val,
                    },
                    selectedNode.data
                  );
                  setSelected(val);
                }
              }}
              showValueIcon
            />
          </div>
          <div className="mt-2">
            <label className="block text-sm font-medium leading-10 text-gray-900">
              Image
            </label>
            <UploadImage />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <label className="block text-sm font-medium leading-10 text-gray-900">
              Help Text
            </label>

            <Button
              className="shadow-sm"
              onClick={() => {
                selectedNode && void router.push(`/help/${selectedNode.id}`);
              }}
              variant={"secondary"}
              size={"sm"}
            >
              Add Help Text
            </Button>
          </div>
        </Tab.Panel>
        <Tab.Panel className={cn("bg-white p-3")}>
          <div className="flex flex-col gap-2">
            <div className="flex rounded border-2 border-slate-300 bg-slate-200 bg-opacity-80 p-2">
              <div className="flex-1 text-sm font-medium text-slate-900">
                For Node
              </div>
              <div className="flex-1 text-sm font-normal text-slate-900 first-letter:uppercase">
                {selectedNode?.data.name}
              </div>
            </div>
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full items-center justify-between rounded-md border bg-sky-100 p-1 hover:bg-sky-200 ">
                    <span className="font-medium text-blue-900">Options</span>
                    <ChevronUpIcon
                      className={`${
                        open ? "rotate-180 transform" : ""
                      } h-5 w-5 text-blue-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel>
                    <Options />
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full items-center justify-between rounded-md border bg-sky-100 p-1 hover:bg-sky-200 ">
                    <span className="font-medium text-blue-900">Variables</span>
                    <ChevronUpIcon
                      className={`${
                        open ? "rotate-180 transform" : ""
                      } h-5 w-5 text-blue-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel></Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </Tab.Panel>
      </Tabs>
    </nav>
  );
}

export default function Tree() {
  const router = useRouter();
  const [leftNavShowing, setLeftNavShowing] = React.useState(true);
  const { setNodesAndEdges, setTree } = useStore(
    ({ setNodesAndEdges, setTree }) => ({
      setNodesAndEdges,
      setTree,
    })
  );
  const tree = api.tree.get.useQuery(
    {
      id: router.query.treeId as string,
    },
    {
      onSuccess(data) {
        if (data) {
          setTree(data);
          setNodesAndEdges([...data.nodes, ...data.bridgeNodes]);
        }
      },
      enabled: !!router.query.treeId,
      refetchOnWindowFocus: false,
    }
  );

  if (tree.isLoading) {
    return (
      <Layout>
        <div className="flex flex-1 items-center justify-center">
          <Loader className="h-8 w-8" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="w-screen border border-gray-200 bg-white">
        <div className="flex h-10 items-center justify-between px-3">
          <div className="flex items-center">
            <button
              className={cn(
                "rounded-md p-1 text-gray-400 transition-opacity duration-200 ease-in-out hover:bg-gray-200 hover:text-gray-500 hover:shadow-sm",
                leftNavShowing ? "pointer-events-none opacity-0" : "opacity-100"
              )}
              onClick={() => {
                setLeftNavShowing(!leftNavShowing);
              }}
            >
              <ChevronDoubleRightIcon className="h-5 w-5" />
            </button>
            <div className="ml-2 text-left text-gray-600">
              Workspace /{" "}
              <Link
                href="/workspace/[id]"
                as={"/workspace/" + (tree.data?.workspaceId ?? "")}
                className="text-blue-500 hover:underline"
              >
                Workspace
              </Link>
              /{" "}
              <Link
                href="/workspace/[id]"
                as="/workspace/"
                className="
            text-blue-500
            hover:underline
          "
              >
                {tree.data?.name}
              </Link>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <ReactFlowProvider>
          <LeftNav
            isShowing={leftNavShowing}
            setIsShowing={setLeftNavShowing}
          />
          <Main className="relative p-0">
            <DisplayTree />
          </Main>
          <RightNav
            isShowing={true}
            setIsShowing={() => {
              console.log("rightnav");
            }}
          />
        </ReactFlowProvider>
      </div>
      <AddNodeModal />
    </Layout>
  );
}

const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();

function UploadImage() {
  const [isOpen, setIsOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState<string | null>(null);
  const [img, setImg] = React.useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [uploadLoding, setUploadLoading] = useState(false);
  const { selectedNode, editNode } = useStore(({ selectedNode, editNode }) => ({
    selectedNode,
    editNode,
  }));
  const { mutateAsync: updateNodeMutation } = api.node.update.useMutation();

  const { getRootProps, getInputProps, files, startUpload } =
    useUploadThing("imageUploader");

  useEffect(() => {
    const file = files[0];
    if (file?.file) {
      const blob = new Blob([file.file], { type: file.file.type });
      const url = URL.createObjectURL(blob);
      setImg(url);
      setImageLoaded(true);
    }
  }, [files]);

  useEffect(() => {
    if (value) {
      axios
        .get(value, {
          responseType: "blob",
        })
        .then((res) => {
          const blob = new Blob([res.data], { type: "image/jpeg" });
          const url = URL.createObjectURL(blob);
          setImg(url);
          setImageLoaded(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [value]);

  if (selectedNode?.data.type === "BridgeType") {
    return null;
  }

  return (
    <>
      <Button
        className="shadow-md"
        size="sm"
        variant="secondary"
        onClick={() => setIsOpen(true)}
      >
        <ArrowUpTrayIcon className="mr-2 h-5 w-5" />
        {selectedNode?.data.img ? "Change Image" : "Upload Image"}
      </Button>
      <Modal
        title="Upload Image"
        isOpen={isOpen}
        setIsOpen={() => setIsOpen(false)}
        initialFocus={inputRef}
      >
        <div className="mt-2 flex flex-col gap-2">
          <div>
            <Textinput
              placeholder="Enter Image URL"
              className="rounded-md"
              size={"sm"}
              leftIcon={<LinkIcon className="h-5 w-5" />}
              isRightIconClickable={true}
              rightIcon={
                (value?.length ?? 0) > 0 &&
                !imageLoaded && (
                  <div
                    className="flex h-5 w-5 items-center justify-center transition-colors duration-200 ease-in-out hover:text-gray-900"
                    onClick={() => {
                      setValue(null);
                      setImageLoaded(false);
                    }}
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </div>
                )
              }
              value={value ?? ""}
              onChange={(e) => setValue(e.target.value)}
              ref={inputRef}
              leftIconLoading={(value?.length ?? 0) > 0 && !imageLoaded}
            />
          </div>

          <div
            className="h-72  rounded-lg border border-dashed border-gray-400 bg-gray-200
           transition-colors duration-200 ease-in-out hover:border-gray-300 hover:bg-gray-100
          "
          >
            {!imageLoaded && (
              <div
                className="flex h-full flex-col items-center justify-center"
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <div className="flex items-center justify-center">
                  <ArrowUpTrayIcon className="h-10 w-10 text-gray-400" />
                </div>
                <div className="text-gray-400">
                  <span className="cursor-pointer text-gray-900 underline decoration-1">
                    Upload
                  </span>{" "}
                  or Drap your image here
                </div>
              </div>
            )}
            {((img?.length ?? 0) > 0 || selectedNode?.data.img) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className={cn(
                  "h-full w-full object-cover",
                  !imageLoaded && "hidden"
                )}
                src={img ?? selectedNode?.data.img ?? ""}
                alt="img"
              />
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                const uploadfiles = async () => {
                  setUploadLoading(true);
                  if (
                    selectedNode &&
                    selectedNode?.data.type !== "BridgeType"
                  ) {
                    if (files.length > 0) {
                      const value = (await startUpload()) as {
                        fileKey: string;
                        fileUrl: string;
                      }[];

                      if (value.length > 0 && selectedNode) {
                        selectedNode.data.img = value[0]?.fileUrl ?? null;
                      }
                    }

                    if (value && img) {
                      const blob = await axios.get(img, {
                        responseType: "blob",
                      });

                      const file = new File([blob.data as Blob], "image.jpg", {
                        type: "image/jpeg",
                      });

                      const value = (await uploadFiles(
                        [file],
                        "imageUploader"
                      )) as {
                        fileKey: string;
                        fileUrl: string;
                      }[];

                      if (value.length > 0 && selectedNode) {
                        selectedNode.data.img = value[0]?.fileUrl ?? null;
                      }
                    }
                    selectedNode && editNode(selectedNode.data);
                    await updateNodeMutation({
                      id: selectedNode.id,
                      img: selectedNode.data.img ?? undefined,
                    });
                  } else {
                    alert("Please select a node");
                  }

                  setUploadLoading(false);
                };
                void uploadfiles();
              }}
              isloading={uploadLoding}
            >
              Save
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setIsOpen(false);
                setValue(null);
                setImg(null);
                setImageLoaded(false);
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
