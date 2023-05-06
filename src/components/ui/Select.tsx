import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { cn } from "~/utils";
import React from "react";

export type Option<T extends string | number> = {
  label: string;
  value: T;
  icon?: React.ReactNode;
};

type SelectProps<T extends string | number> = {
  options: Option<T>[];
  selected: string | null;
  setSelected: (val: T) => void;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showValueIcon?: boolean;
  selectBtnClass?: string;
  showValue?: boolean;
  dropdownClass?: string;
  listboxClass?: string;
  placeholder?: string;
};

export default function Select<T extends string | number>({
  options,
  selected,
  setSelected,
  showValue = true,
  ...props
}: SelectProps<T>) {
  const selectedOption = React.useMemo(
    () => options.find((option) => option.value === selected),
    [options, selected]
  );

  return (
    <Listbox value={selected} onChange={(T) => setSelected(T as T)}>
      <div className="relative">
        <Listbox.Button
          className={cn(
            "relative flex w-full cursor-default items-center rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm",
            ((selectedOption?.icon && props.showValueIcon) || props.leftIcon) &&
              "pl-10",
            !showValue && "pl-0",
            props.selectBtnClass
          )}
        >
          {props?.leftIcon &&
            !(selectedOption?.icon && props.showValueIcon) && (
              <span
                className={cn(
                  "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2"
                )}
              >
                {props?.leftIcon}
              </span>
            )}
          {selectedOption?.icon && props.showValueIcon && (
            <span
              className={cn(
                "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2",
                !showValue && "relative"
              )}
            >
              {selectedOption?.icon}
            </span>
          )}
          {showValue && (
            <span
              className={cn(
                "block truncate",
                !selectedOption?.label && "text-gray-400"
              )}
            >
              {selectedOption?.label ?? props.placeholder ?? "Select an option"}
            </span>
          )}
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            {props.rightIcon ? (
              props?.rightIcon
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
          <Listbox.Options
            className={cn(
              "absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
              props.dropdownClass
            )}
          >
            {options.map((value, valueIdx) => (
              <Listbox.Option
                key={valueIdx}
                className={({ active }) =>
                  cn(
                    "relative cursor-default select-none py-3 pl-3 pr-4",
                    active ? "bg-gray-100 text-gray-900" : "text-gray-900",
                    value.icon && "pl-10",
                    props.listboxClass
                  )
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
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 ">
                      {value.icon}
                    </span>
                  </>
                )}
              </Listbox.Option>
            ))}
            {options.length === 0 && (
              <Listbox.Option
                className={({ active }) =>
                  cn(
                    "relative cursor-default select-none py-3 pl-3 pr-4",
                    active ? "bg-gray-100 text-gray-900" : "text-gray-900",
                    props.listboxClass
                  )
                }
                value={null}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate pl-1 ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      No options
                    </span>
                  </>
                )}
              </Listbox.Option>
            )}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
