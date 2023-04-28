import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import React from "react";
import { cn } from "~/utils";

export function Dropdown({
  children,
  button,
  className,
  onClose,
  disabled,
}: {
  children: React.ReactNode;
  button: React.ReactNode;
  className?: string;
  onClose?: () => void;
  disabled?: boolean;
}) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button as={React.Fragment}>{button}</Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        beforeLeave={onClose}
      >
        <Menu.Items
          className={cn(
            "absolute mt-2 w-56 origin-top-left divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
            className
          )}
        >
          {children}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export function MenuGroup({
  className,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  return <div className={cn("px-1 py-1", className)} {...props} />;
}

export function MenuItem({
  className,
  ...props
}: Omit<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
  "children"
> & {
  children: React.FC<{
    active: boolean;
    disabled: boolean;
    close: () => void;
  }>;
}) {
  return (
    <Menu.Item>
      {({ active, close, disabled }) => (
        <button
          className={cn(
            "text-gray-900 ui-active:bg-blue-600 ui-active:text-white",
            "group flex w-full items-center rounded-md px-2 py-2 text-sm",
            className
          )}
          {...props}
          // eslint-disable-next-line react/no-children-prop
          children={props.children({ active, close, disabled })}
        />
      )}
    </Menu.Item>
  );
}
