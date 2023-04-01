import { useState } from "react";
import { Tab } from "@headlessui/react";
import { cn } from "~/utils";

export default function Tabs({
  tabs,
  children,
}: {
  tabs: string[];
  children: React.ReactNode;
}) {
  return (
    <Tab.Group>
      <Tab.List className="flex space-x-2 border-b-2 border-gray-200 px-3">
        {tabs.map((tab) => (
          <Tab
            key={tab}
            className={({ selected }) =>
              cn(
                "w-fit py-3 text-base font-medium leading-5 text-gray-400 ",
                "-mb-[2px] border-spacing-2 border-b-[3px] transition-colors duration-300 ease-in-out focus:outline-none",
                selected
                  ? "border-b-[3px] border-blue-500 text-gray-900"
                  : "border-transparent hover:border-gray-300"
              )
            }
          >
            {tab}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-2">{children}</Tab.Panels>
    </Tab.Group>
  );
}
