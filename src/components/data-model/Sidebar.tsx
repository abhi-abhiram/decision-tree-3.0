import { CubeIcon, EyeIcon } from "@heroicons/react/24/outline";
import { CubeIcon as SolidCubeIcon } from "@heroicons/react/24/solid";
import { Button } from "../ui/Button";
import Nav from "../ui/Nav";
import React from "react";
import { PlusIcon } from "@heroicons/react/24/solid";

export default function Sidebar() {
  const [isShowing, setIsShowing] = React.useState(true);
  return (
    <Nav isShowing={isShowing}>
      <div className="flex h-full flex-col p-4">
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Models</span>
            <button className="rounded-md p-2 text-neutral-500 hover:bg-gray-100 hover:text-inherit">
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-1 flex-col overflow-auto">
            <button className="group flex items-center rounded-md p-2 text-left text-sm hover:bg-gray-100">
              {false ? (
                <SolidCubeIcon className="mr-2 inline-block h-4 w-4 text-gray-500 group-hover:text-inherit" />
              ) : (
                <CubeIcon className="mr-2 inline-block h-4 w-4 text-gray-500 group-hover:text-inherit" />
              )}
              User
            </button>
            <button className="group flex items-center rounded-md p-2 text-left text-sm hover:bg-gray-100">
              {false ? (
                <SolidCubeIcon className="mr-2 inline-block h-4 w-4 text-gray-500 group-hover:text-inherit" />
              ) : (
                <CubeIcon className="mr-2 inline-block h-4 w-4 text-gray-500 group-hover:text-inherit" />
              )}
              Employee
            </button>
          </div>
        </div>
        <div className="pt-4">
          <Button className="w-full bg-slate-400 transition-colors duration-200 ease-in-out hover:bg-slate-500">
            Visualize Schema <EyeIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Nav>
  );
}
