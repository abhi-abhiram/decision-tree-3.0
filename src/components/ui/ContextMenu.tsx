import { cn } from "~/utils";
import React from "react";
import { Transition } from "@headlessui/react";
import { useOnClickOutside } from "~/utils/hooks";

const ContextListItem = ({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <li
      className={cn(
        "cursor-pointer rounded-md px-3 py-1 text-sm text-gray-700 transition-colors duration-150 ease-in-out hover:bg-blue-500 hover:text-white",
        className
      )}
      onClick={onClick}
    >
      {children}
    </li>
  );
};

const ContextList = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <ul className={cn("space-y-1 p-1", className)}>{children}</ul>;
};

const Break = () => {
  return <div className="border-t border-gray-200"></div>;
};

export const ContextMenu = ({
  isShowing,
  clientX,
  clientY,
  setShowing,
}: {
  isShowing: boolean;
  clientX: number;
  clientY: number;
  setShowing: (showing: boolean) => void;
}) => {
  const menuref = React.useRef<HTMLDivElement>(null);

  useOnClickOutside(menuref, () => {
    setShowing(false);
  });

  return (
    <Transition show={isShowing}>
      <div
        className={cn(
          "absolute left-0 mt-2 w-56 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        )}
        style={{ top: clientY, left: clientX }}
        ref={menuref}
      >
        <ContextList>
          <ContextListItem>Open</ContextListItem>
          <ContextListItem>Open in new tab</ContextListItem>
          <ContextListItem>Edit</ContextListItem>
          <Break />
          <ContextListItem>Rename</ContextListItem>
          <ContextListItem>Copy</ContextListItem>
          <ContextListItem>Move</ContextListItem>
          <Break />
          <ContextListItem>Delete</ContextListItem>
        </ContextList>
      </div>
    </Transition>
  );
};
