import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ChevronDoubleRightIcon } from "@heroicons/react/20/solid";
import { PlusIcon } from "@heroicons/react/24/solid";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "~/components/ui/Button";
import { Dropdown, MenuGroup, MenuItem } from "~/components/ui/Dropdown";
import Layout from "~/components/ui/Layout";
import { Main } from "~/components/ui/Main";
import { cn } from "~/utils";
import { Nav } from "..";
import Link from "next/link";

const data = [
  {
    name: "Tree 1",
    created: "2021-01-01",
    updated: "2021-01-01",
  },
  {
    name: "Tree 2",
    created: "2021-01-01",
    updated: "2021-01-01",
  },
  {
    name: "Tree 3",
    created: "2021-01-01",
    updated: "2021-01-01",
  },
  {
    name: "Tree 1",
    created: "2021-01-01",
    updated: "2021-01-01",
  },
  {
    name: "Tree 2",
    created: "2021-01-01",
    updated: "2021-01-01",
  },
  {
    name: "Tree 3",
    created: "2021-01-01",
    updated: "2021-01-01",
  },
  {
    name: "Tree 1",
    created: "2021-01-01",
    updated: "2021-01-01",
  },
  {
    name: "Tree 2",
    created: "2021-01-01",
    updated: "2021-01-01",
  },
  {
    name: "Tree 3",
    created: "2021-01-01",
    updated: "2021-01-01",
  },
  {
    name: "Tree 1",
    created: "2021-01-01",
    updated: "2021-01-01",
  },
  {
    name: "Tree 2",
    created: "2021-01-01",
    updated: "2021-01-01",
  },
  {
    name: "Tree 3",
    created: "2021-01-01",
    updated: "2021-01-01",
  },
];

export default function Workspace() {
  const router = useRouter();
  const [navShowing, setNavShowing] = React.useState(true);
  return (
    <Layout>
      <header className="w-screen border border-gray-200 bg-gray-50">
        <div className="flex h-10 items-center justify-between px-3">
          <div className="flex items-center">
            <button
              className={cn(
                "rounded-md p-1 text-gray-400 transition-opacity duration-200 ease-in-out hover:bg-gray-200 hover:text-gray-500 hover:shadow-sm",
                navShowing ? "pointer-events-none opacity-0" : "opacity-100"
              )}
              onClick={() => {
                setNavShowing(!navShowing);
              }}
            >
              <ChevronDoubleRightIcon className="h-5 w-5" />
            </button>
            <div className="ml-2 text-left text-gray-600">
              Workspace /{" "}
              <Link
                href="/workspace/[id]"
                as="/workspace/1"
                className="
                text-blue-500
                hover:underline
              "
              >
                Workspace Name
              </Link>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <Nav isShowing={navShowing} setIsShowing={setNavShowing} />
        <Main>
          <div className="flex h-full flex-col">
            <div className="sticky top-0">
              <div>
                <div className="flex items-center gap-1">
                  <h1 className="text-2xl font-medium">workspace name</h1>
                  <Dropdown
                    button={
                      <button className="rounded-md p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-500 ">
                        <EllipsisHorizontalIcon className="h-5 w-5" />
                      </button>
                    }
                    className=" top-0 mt-0 w-24 translate-x-8"
                  >
                    <MenuGroup>
                      <MenuItem>
                        {({ active, close, disabled }) => (
                          <>
                            <span>Copy Link</span>
                          </>
                        )}
                      </MenuItem>
                    </MenuGroup>
                    <MenuGroup>
                      <MenuItem>
                        {({ active, close, disabled }) => <span>Rename</span>}
                      </MenuItem>
                      <MenuItem className="text-red-600 ui-active:bg-red-600">
                        {({ active, close, disabled }) => <span>Delete</span>}
                      </MenuItem>
                    </MenuGroup>
                  </Dropdown>
                </div>
              </div>
              <div className="flex justify-between border-b border-gray-200 py-6">
                <Button className="shadow-md" size="sm">
                  <PlusIcon className="mr-2 h-5 w-5" />
                  Create Tree
                </Button>
                <div className="flex">
                  <Button>Button</Button>
                  <Button>Button</Button>
                </div>
              </div>
              <div className="sticky top-0 flex flex-row items-center py-3  text-sm font-medium text-gray-500 [&>*]:px-3">
                <div className="w-1/2">Name</div>
                <div className="grow">Created</div>
                <div className="grow">Updated</div>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-2 overflow-auto text-left text-sm text-gray-900">
              {data.map((item) => (
                <div
                  className="group flex cursor-pointer flex-row items-center rounded-xl bg-gray-200 py-3 font-medium transition-colors duration-200 ease-in-out
                  hover:bg-gray-300 hover:shadow-sm [&>*]:px-3
                  "
                >
                  <div className="relative w-1/2">
                    {item.name}
                    <div className="invisible absolute top-1/2 right-0 flex -translate-y-1/2 gap-1 group-hover:visible">
                      <button
                        className="rounded-md p-1 text-blue-600 transition-transform duration-200 ease-in-out hover:scale-110
                        hover:bg-blue-100 hover:shadow-sm 
                        "
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button className="hover:text-red- rounded-md p-1 text-red-600 transition-transform duration-200 ease-in-out hover:scale-110 hover:bg-red-100 hover:shadow-sm">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="grow">{item.created}</div>
                  <div className="grow">{item.updated}</div>
                </div>
              ))}
            </div>
          </div>
        </Main>
      </div>
    </Layout>
  );
}
