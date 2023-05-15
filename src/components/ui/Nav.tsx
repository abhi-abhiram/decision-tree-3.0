import { Transition } from "@headlessui/react";
import { cn } from "~/utils";

export default function Nav({
  isShowing,
  children,
  width = "w-72",
}: {
  isShowing: boolean;
  children: React.ReactNode;
  width?: string;
}) {
  return (
    <Transition
      as={"nav"}
      show={isShowing}
      enter="transition-all duration-500 ease-in-out"
      enterFrom="opacity-0 w-0"
      enterTo={`opacity-100 ${width}`}
      leave="transition-all duration-500 ease-in-out"
      leaveFrom={`opacity-100 ${width}`}
      leaveTo="opacity-0 w-0"
      className={cn(
        "relative h-full scroll-m-1 scroll-p-1 overflow-y-auto border-r border-gray-200 bg-white ease-in-out ",
        width
      )}
    >
      {children}
    </Transition>
  );
}
