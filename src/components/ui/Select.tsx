import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { cn } from "~/utils";
import React from "react";

type Option = {
  label: string;
  value: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

type SelectProps = {
  options: Option[];
  selected: string | null;
  setSelected: (val: string) => void;
};

export default function Select({
  options,
  selected,
  setSelected,
}: SelectProps) {
  const selectedOption = React.useMemo(
    () => options.find((option) => option.value === selected),
    [options, selected]
  );

  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="relative">
        <Listbox.Button
          className={cn(
            "relative w-full cursor-default rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm",
            selectedOption?.leftIcon && "pl-10"
          )}
        >
          {selectedOption?.leftIcon && (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
              {selectedOption?.leftIcon}
            </span>
          )}
          <span
            className={cn(
              "block truncate",
              !selectedOption?.label && "text-gray-400"
            )}
          >
            {selectedOption?.label ?? "Select an option"}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            {selectedOption?.rightIcon ? (
              selectedOption?.rightIcon
            ) : (
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            )}
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {options.map((value, valueIdx) => (
              <Listbox.Option
                key={valueIdx}
                className={({ active }) =>
                  `relative cursor-default select-none py-3 pl-10 pr-4 ${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-900"
                  }`
                }
                value={value.value}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate pl-1 ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {value.label}
                    </span>
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                      <span className="flex items-center justify-center rounded-md bg-purple-400 p-1 text-black">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-5 w-5"
                        >
                          <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                          <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                        </svg>
                      </span>
                    </span>
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
