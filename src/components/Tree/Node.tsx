import { EllipsisVerticalIcon, EnvelopeIcon } from "@heroicons/react/20/solid";
import React from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import { NodeProps } from "reactflow";
import { Node as CustomNode } from "@prisma/client";
import { Dropdown, MenuGroup, MenuItem } from "../ui/Dropdown";
import { cn } from "~/utils";
import useStore from "./store";
import { Textarea, TextareaProps } from "../ui/Textarea";

export function InputEditable(
  props: Omit<TextareaProps, "onBlur"> & {
    onBlur?: () => void;
    edit: boolean;
    setEdit: (val: string) => void;
  }
) {
  const renameInputRef = React.useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = React.useState(props.value);

  React.useEffect(() => {
    if (props.edit) {
      renameInputRef.current?.focus();
    }
  }, [props.edit]);

  return (
    <div
      className={cn(
        "flex h-full flex-1 flex-col overflow-hidden",
        props.edit && "overflow-visible"
      )}
    >
      {!props.edit ? (
        <div className="flex flex-1 text-ellipsis p-0.5 text-xs">
          <p className="overflow-hidden text-ellipsis break-words">
            {props.value}
          </p>
        </div>
      ) : (
        <div className="relative z-10 flex-1">
          <Textarea
            ref={renameInputRef}
            defaultValue={value}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (typeof value === "string" && value?.length > 0) {
                  props.setEdit(value);
                }
                props.onBlur?.();
              }
            }}
            {...props}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            value={value}
            variant={value?.toString().length === 0 ? "error" : "default"}
            className="nopan h-full p-0 text-xs"
          />
        </div>
      )}
      {value?.toString().length === 0 && props.edit && (
        <p className="text-xs text-red-500">Question cannot be empty</p>
      )}
    </div>
  );
}

export function TextUpdaterNode(props: NodeProps<CustomNode>) {
  const reactflow = useReactFlow();
  const addNode = useStore((state) => state.addNode);
  const [rename, setRename] = React.useState(false);

  return (
    <div
      className={cn(
        "group flex h-24 w-64 animate-fade-in flex-col rounded-md border-2 border-stone-400 bg-white px-4 py-2 shadow-md transition-colors duration-200 ease-in-out hover:border-stone-900"
      )}
    >
      <div className="flex h-full flex-1 items-center gap-1">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <EnvelopeIcon className="h-5 w-5 text-violet-500" />
        </div>
        <div className="ml-2 flex h-full flex-1 flex-col ">
          <InputEditable
            value={props.data.question}
            edit={rename}
            setEdit={() => {
              setRename(false);
            }}
            onBlur={() => {
              setRename(false);
            }}
            className="nopan h-fit w-full rounded-md pl-0 pr-0 text-xs"
          />
          <div className="p-0.5 text-gray-500">Namaste</div>
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
          className=" top-0 z-[100] mt-0 w-24 translate-x-8"
        >
          <MenuGroup>
            <MenuItem
              onClick={() => {
                addNode({ ...props.data });
              }}
            >
              {() => <span>Add Node</span>}
            </MenuItem>
          </MenuGroup>
          <MenuGroup>
            <MenuItem
              onClick={() => {
                setRename(true);
              }}
            >
              {() => <span>Rename</span>}
            </MenuItem>
            <MenuItem
              className="text-red-600 ui-active:bg-red-600"
              onClick={() => {
                reactflow.deleteElements({ nodes: [props] });
              }}
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
