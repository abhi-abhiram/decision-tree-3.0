import { Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import React from "react";
import { cn } from "~/utils";

export default function Drawer({
  children,
  title,
  isShowing,
  setIsShowing,
}: {
  title?: string;
  children: React.ReactNode;
  isShowing: boolean;
  setIsShowing: (show: boolean) => void;
}) {
  return (
    <div>
      <Transition
        show={isShowing}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        as={React.Fragment}
      >
        <div className="felx fixed left-0 top-0 h-screen w-screen bg-slate-900 bg-opacity-40"></div>
      </Transition>

      <div
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-96 -translate-x-full flex-col gap-2 overflow-hidden overflow-y-scroll bg-white p-2 transition duration-200 ease-in-out",
          isShowing && "translate-x-0"
        )}
      >
        <div className="flex items-center justify-between self-stretch">
          <div>
            <h1 className="text-left text-2xl font-medium first-letter:uppercase">
              {title}
            </h1>
          </div>
          <div className="flex items-center justify-center">
            <button
              className="rounded-md p-1 hover:bg-gray-200"
              onClick={() => setIsShowing(false)}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
