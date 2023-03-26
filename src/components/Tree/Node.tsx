import {
  EllipsisHorizontalIcon,
  EnvelopeIcon,
} from "@heroicons/react/20/solid";
import React from "react";
import { Edge, Handle, Position, useReactFlow } from "reactflow";
import * as d3 from "d3-hierarchy";
import { NodeProps } from "reactflow";
import { Node as ReactFlowNode } from "reactflow";
import { Node as CustomNode } from "@prisma/client";
import { Dropdown, MenuGroup, MenuItem } from "../ui/Dropdown";
import { cn } from "~/utils";
import useStore from "./store";
import { Transition } from "@headlessui/react";

export function TextUpdaterNode(props: NodeProps<CustomNode>) {
  const addNode = useStore((state) => state.addNode);

  return (
    <div
      className={cn(
        "rounded-md border-2 border-stone-400 bg-white px-4 py-2 shadow-md transition-colors duration-200 ease-in-out hover:border-stone-900"
      )}
    >
      <div className="flex items-center ">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <EnvelopeIcon className="h-5 w-5 text-violet-500" />
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{props.data.name}</div>
          <div className="text-gray-500">Namaste</div>
        </div>
        <Dropdown
          button={
            <button className="nopan rounded-md p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-500">
              <EllipsisHorizontalIcon className="h-5 w-5" />
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
              {({ active, close, disabled }) => <span>Add Node</span>}
            </MenuItem>
          </MenuGroup>
          <MenuGroup>
            <MenuItem>
              {({ active, close, disabled }) => <span>Rename</span>}
            </MenuItem>
            <MenuItem className="text-red-600 ui-active:bg-red-600">
              {({ active, close, disabled }) => <span>Delete</span>}
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

export function getTreeLayout<
  T extends { id: string; parentId: string | null }
>(nodes: T[]): [ReactFlowNode<T>[], Edge<T>[]] {
  const resultNodes: ReactFlowNode<T>[] = [];

  const resultEdges: Edge<T>[] = [];

  var root = d3
    .stratify<(typeof nodes)[number]>()
    .id(function (d) {
      return d.id;
    })
    .parentId(function (d) {
      return d.parentId;
    })(nodes);

  d3.tree<(typeof nodes)[number]>()
    .nodeSize([150, 300])
    .separation(function (a, b) {
      return a.parent == b.parent ? 1 : 2;
    })(root)
    .each((node) => {
      const x = node.x;
      node.x = node.y;
      node.y = x;

      resultNodes.push({
        id: node.data.id,
        type: "textUpdater",
        position: { x: node.x, y: node.y },
        data: node.data,
        dragHandle: ".custom-drag-handle",
      });

      resultEdges.push({
        id: `${node.parent?.id}-${node.id}`,
        source: node.parent?.id ?? "",
        target: node.id ?? "",
        data: node.data,
      });
    });

  return [resultNodes, resultEdges];
}
