import { ChevronDoubleRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Layout from "~/components/ui/Layout";
import { Main } from "~/components/ui/Main";
import "reactflow/dist/style.css";
import { cn } from "~/utils";
import DisplayTree from "~/components/Tree/DisplayTree";
import { ReactFlowProvider } from "reactflow";

export default function useWorkspaceId() {
  const router = useRouter();
  const [navShowing, setNavShowing] = React.useState(true);

  return (
    <Layout>
      <header className="w-screen border border-gray-200 bg-white">
        <div className="flex h-10 items-center justify-between px-3">
          <div className="flex items-center">
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
                Workspace Name{" "}
              </Link>
              /{" "}
              <Link
                href="/workspace/[id]"
                as="/workspace/1"
                className="
            text-blue-500
            hover:underline
          "
              >
                Tree Name
              </Link>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        {/* <Nav isShowing={navShowing} setIsShowing={setNavShowing} /> */}
        <Main className="p-0">
          <ReactFlowProvider>
            <DisplayTree />
          </ReactFlowProvider>
        </Main>
      </div>
    </Layout>
  );
}
