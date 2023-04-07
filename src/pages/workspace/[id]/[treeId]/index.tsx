import {
  ArrowDownCircleIcon,
  ArrowUpTrayIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  LinkIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Layout from "~/components/ui/Layout";
import { Main } from "~/components/ui/Main";
import "reactflow/dist/style.css";
import DisplayTree from "~/components/Tree/DisplayTree";
import { ReactFlowProvider } from "reactflow";
import { cn } from "~/utils";
import { Textinput } from "~/components/ui/Textinput";
import { type Node as CustomNode } from "@prisma/client";
import useStore, { type RFState } from "~/components/Tree/store";
import { shallow } from "zustand/shallow";
import Tabs from "~/components/ui/Tabs";
import { Tab } from "@headlessui/react";
import { Textarea } from "~/components/ui/Textarea";
import _ from "lodash";
import Select from "~/components/ui/Select";
import { Button } from "~/components/ui/Button";
import Modal from "~/components/ui/Model";

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

function LeftNav({
  isShowing,
  setIsShowing,
}: {
  isShowing: boolean;
  setIsShowing: (isShowing: boolean) => void;
}) {
  const [query, setQuery] = React.useState("");
  const { nodes } = useStore(selector, shallow);
  const [nodeId, setNodeId] = React.useState<string | undefined>(undefined);

  const filtereddata = React.useMemo(() => {
    return query === ""
      ? nodes
      : nodes.filter((data) =>
          data.data.question
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
  }, [query, nodes]);

  return (
    <nav
      className={cn(
        "relative h-full scale-x-100 scroll-m-1 scroll-p-1 overflow-y-auto border-r border-gray-200 bg-white duration-200 ease-in-out",
        isShowing ? "w-72" : "w-0 overflow-hidden p-0"
      )}
    >
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
              "h-20 cursor-pointer px-4 py-2 text-xs text-gray-900 transition-colors duration-200 ease-in-out hover:bg-gray-200"
            )}
            key={val.id}
          >
            <div className="flex h-full items-center">
              <span className="flex items-center justify-center rounded-md bg-purple-400 p-1 text-black">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                  <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                </svg>
              </span>
              <div className="a ml-2 flex h-full flex-1 flex-col justify-center overflow-hidden">
                {_.truncate(val.data.question, {
                  length: 140,
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}

const options = [
  {
    label: "label",
    value: "value",
    icon: (
      <span className="flex items-center justify-center rounded-md bg-purple-400 p-1 text-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
          <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
        </svg>
      </span>
    ),
  },
  {
    label: "label 2",
    value: "value 2",
    icon: (
      <span className="flex items-center justify-center rounded-md bg-purple-400 p-1 text-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
          <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
        </svg>
      </span>
    ),
  },
];

function RightNav({
  isShowing,
  setIsShowing,
  data,
}: {
  isShowing: boolean;
  setIsShowing: (isShowing: boolean) => void;
  data: CustomNode[];
}) {
  const [selected, setSelected] = React.useState<string | null>(null);
  const router = useRouter();

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
              Question
            </label>
            <div>
              <Textarea
                className="rounded-md shadow-sm"
                rows={3}
                placeholder="Enter your question here?"
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
                setSelected(val);
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
              onClick={() => setIsShowing(false)}
              variant={"secondary"}
              size={"sm"}
            >
              Add Help Text
            </Button>
          </div>
        </Tab.Panel>
        <Tab.Panel className={cn("bg-white p-3")}>Tab 2</Tab.Panel>
      </Tabs>
    </nav>
  );
}

export default function useWorkspaceId() {
  const router = useRouter();
  const [leftNavShowing, setLeftNavShowing] = React.useState(true);

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
                as="/workspace/1"
                className="text-blue-500 hover:underline"
              >
                Workspace Name{" "}
              </Link>
              /{" "}
              <Link
                href="/workspace/[id]"
                as="/workspace/1"
                className="
            text-blue-500
            hover:underline
          "
              >
                Tree Name
              </Link>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <LeftNav isShowing={leftNavShowing} setIsShowing={setLeftNavShowing} />
        <Main className="p-0">
          <ReactFlowProvider>
            <DisplayTree />
          </ReactFlowProvider>
        </Main>
        <RightNav
          isShowing={true}
          setIsShowing={() => {
            console.log("rightnav");
          }}
          data={[]}
        />
      </div>
    </Layout>
  );
}

function UploadImage() {
  const [isOpen, setIsOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState<string | null>(null);

  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <>
      <Button
        className="shadow-md"
        size="sm"
        variant="secondary"
        onClick={() => setIsOpen(true)}
      >
        <ArrowUpTrayIcon className="mr-2 h-5 w-5" />
        Upload Image
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
                (value?.length ?? 0) > 0 && (
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
              <div className="flex h-full flex-col items-center justify-center">
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
            {(value?.length ?? 0) > 0 && (
              <img
                className={cn(
                  "h-full w-full object-cover",
                  !imageLoaded && "hidden"
                )}
                onLoad={() => setImageLoaded(true)}
                src={value ?? ""}
              />
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button>Save</Button>
            <Button
              variant="secondary"
              onClick={() => {
                setIsOpen(false);
                setValue(null);
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
