import {
  CubeTransparentIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/20/solid";
import React from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import { type NodeProps } from "reactflow";
import { type BridgeNode } from "@prisma/client";
import { Dropdown, MenuGroup, MenuItem } from "../ui/Dropdown";
import { cn } from "~/utils";
import useStore from "./store";
import { api } from "~/utils/api";
import useNodeSelectStore from "~/store/nodeSelect";

export function InputEditable(props: {
  editable: boolean;
  setEditable: (val: boolean) => void;
  value: string;
  onKeyEnter: (val: string) => void;
}) {
  const renameInputRef = React.useRef<HTMLInputElement>(null);
  const [value, setValue] = React.useState(props.value);

  React.useEffect(() => {
    if (props.editable) {
      renameInputRef.current?.focus();
    }
  }, [props.editable]);

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden",
        props.editable && "overflow-visible"
      )}
    >
      {!props.editable ? (
        <div className="flex p-0.5">
          <span className="whitespace-nowrap text-sm">{props.value}</span>
        </div>
      ) : (
        <div className="relative z-10 w-full">
          <input
            ref={renameInputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (typeof value === "string" && value?.length > 0) {
                  props.onKeyEnter(value);
                }
                props.setEditable(false);
              }
            }}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            onBlur={() => {
              props.setEditable(false);
              setValue(props.value);
            }}
            disabled={!props.editable}
            value={value}
            className="nopan w-full p-0 text-sm"
          />
        </div>
      )}
    </div>
  );
}

export function BridgeNode(props: NodeProps<BridgeNode>) {
  const { setCenter } = useReactFlow();
  const { editNode, tree, deleteNode, selectedNode, setNode } = useStore(
    (state) => ({
      addNode: state.addNode,
      editNode: state.editNode,
      tree: state.tree,
      deleteNode: state.deleteNode,
      selectedNode: state.selectedNode,
      setNode: state.setSelectedNode,
    })
  );
  const [rename, setRename] = React.useState(false);
  const { mutateAsync: editNodeMutation } =
    api.bridge.updateBridgeNode.useMutation();
  const { mutateAsync: deleteNodeMutation } =
    api.bridge.deleteBridgeNode.useMutation();

  return (
    <div
      className={cn(
        "group flex h-24 w-64 animate-fade-in flex-col rounded-md border-2 border-stone-400 bg-white px-4 py-2 shadow-md transition-colors duration-200 ease-in-out hover:border-stone-900",
        selectedNode?.id === props.id && "border-stone-900"
      )}
      onClick={() => {
        setCenter(props.xPos + 128, props.yPos + 48, {
          duration: 300,
          zoom: 1,
        });
        setNode({ ...props, position: { x: props.xPos, y: props.yPos } });
      }}
    >
      <div className="flex h-full flex-1 items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <CubeTransparentIcon className={"h-5 w-5"} />
        </div>
        <div className="flex h-full flex-1 flex-col items-stretch justify-center">
          <InputEditable
            value={props.data.name}
            editable={rename}
            setEditable={setRename}
            onKeyEnter={(val) => {
              editNode({ ...props.data, name: val });
              void editNodeMutation({ id: props.id, name: val });
            }}
          />
          <div className="p-0.5 text-gray-500">{props.data.type}</div>
        </div>
        <Dropdown
          button={
            <button
              className={cn(
                "nopan rounded-md p-1 text-gray-500 opacity-0 transition-opacity duration-200 ease-in-out hover:bg-gray-200 hover:text-gray-500 group-hover:opacity-100"
              )}
            >
              <EllipsisVerticalIcon className="h-5 w-5" />
            </button>
          }
          className="nopan top-0 z-[100] mt-0 w-24 translate-x-8"
        >
          <MenuGroup>
            <MenuItem
              onClick={() => {
                setRename(true);
              }}
            >
              {() => <span>Rename</span>}
            </MenuItem>
            <MenuItem
              className={cn(
                "text-red-600 ui-active:bg-red-600",
                tree?.rootNodeId === props.id && "cursor-not-allowed opacity-50"
              )}
              onClick={() => {
                void deleteNodeMutation({ id: props.id });
                deleteNode(props.id);
              }}
              disabled={tree?.rootNodeId === props.id}
            >
              {() => <span>Delete</span>}
            </MenuItem>
          </MenuGroup>
        </Dropdown>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        className="!-left-3 !h-6 !w-6 !rounded-full !border-4 !border-blue-500 !bg-gray-50"
      ></Handle>
      <Handle
        type="source"
        position={Position.Right}
        className="!-right-3 !h-6 !w-6 !rounded-full !border-4 !border-blue-500 !bg-gray-50"
      ></Handle>
    </div>
  );
}
