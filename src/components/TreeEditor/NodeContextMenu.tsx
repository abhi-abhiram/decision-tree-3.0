import React, { useRef } from "react";
import { cn } from "~/utils";
import { Node as CustomNode } from "@prisma/client";
import { Node as ReactFlowNode } from "reactflow";
import { useOnClickOutside } from "~/utils/hooks";

type NodeContextMenuProps = {
  node: ReactFlowNode<CustomNode> | null;
  divProps?: React.HTMLAttributes<HTMLDivElement>;
  onContextMenuClose: () => void;
};

export default function NodeContextMenu(props: NodeContextMenuProps) {
  const { node } = props;
  const contextMenuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(contextMenuRef, props.onContextMenuClose);

  return (
    <div
      className={cn(
        "absolute z-50 w-40 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
        !node && "invisible"
      )}
      {...props.divProps}
      ref={contextMenuRef}
      onBlur={() => props.onContextMenuClose()}
    >
      <div className={cn("px-1 py-1")}>
        <NodeMenuBtn>Add Node</NodeMenuBtn>
      </div>
    </div>
  );
}

function NodeMenuBtn({
  className,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button
      className={cn(
        "text-gray-900 hover:bg-blue-600 hover:text-white",
        "group flex w-full items-center rounded-md px-2 py-2 text-sm",
        className
      )}
      {...props}
    />
  );
}
