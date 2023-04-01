import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { Fragment, useState } from "react";
import { cn } from "~/utils";

interface ModelProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  isOpen: boolean;
  setIsOpen: () => void;
  title?: string;
  bgClassName?: string;
  initialFocus?: React.MutableRefObject<HTMLElement | null>;
  titleClassName?: string;
}

export default function Modal({
  isOpen,
  setIsOpen,
  title,
  children,
  bgClassName,
  className,
  initialFocus,
  titleClassName,
}: ModelProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={setIsOpen}
        initialFocus={initialFocus}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className={cn("fixed inset-0 bg-black bg-opacity-25", bgClassName)}
          />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={cn(
                  "relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all",
                  className
                )}
              >
                <div className="flex items-center">
                  <Dialog.Title
                    as="h3"
                    className={cn(
                      "text-lg font-medium leading-6 text-gray-900",
                      titleClassName
                    )}
                  >
                    {title}
                  </Dialog.Title>
                  <button
                    className="ml-auto rounded-md p-1 text-gray-400 transition-opacity duration-200 ease-in-out hover:bg-gray-200 hover:text-gray-500 hover:shadow-sm "
                    onClick={setIsOpen}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
