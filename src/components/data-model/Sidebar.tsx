import { CubeIcon, EyeIcon } from "@heroicons/react/24/outline";
import { CubeIcon as SolidCubeIcon } from "@heroicons/react/24/solid";
import { Button } from "../ui/Button";
import Nav from "../ui/Nav";
import React from "react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import CreateModel from "./CreateModel";
import Link from "next/link";

export default function Sidebar() {
  const models = api.model.models.useQuery();
  const { query, push } = useRouter();

  return (
    <Nav isShowing={true}>
      <div className="flex h-full flex-col p-4">
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Models</span>
            <CreateModel />
          </div>
          <div className="flex flex-1 flex-col overflow-auto">
            {models.data?.map((model) => (
              <Link
                className="group flex items-center rounded-md p-2 text-left text-sm hover:bg-gray-100"
                key={model.id}
                href={`/data-model/${model.id}`}
              >
                {query.id === model.id ? (
                  <SolidCubeIcon className="mr-2 inline-block h-4 w-4 text-gray-500 group-hover:text-inherit" />
                ) : (
                  <CubeIcon className="mr-2 inline-block h-4 w-4 text-gray-500 group-hover:text-inherit" />
                )}
                {model.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="pt-4">
          <Button
            className="w-full bg-slate-400 transition-colors duration-200 ease-in-out hover:bg-slate-500"
            onClick={() => {
              void push(`/data-model/`);
            }}
          >
            Visualize Schema <EyeIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Nav>
  );
}
