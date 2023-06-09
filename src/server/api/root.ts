import { createTRPCRouter } from "~/server/api/trpc";
import { workspaceRouter } from "./routers/workspace";
import { folderRouter } from "./routers/folder";
import { treeRouter } from "./routers/tree";
import { nodeRouter } from "./routers/node";
import { optionRouter } from "./routers/option";
import { bridgeRouter } from "./routers/bridge";
import { variableRouter } from "./routers/variable";
import { modelRouter } from "./routers/model";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  workspace: workspaceRouter,
  folder: folderRouter,
  tree: treeRouter,
  node: nodeRouter,
  option: optionRouter,
  bridge: bridgeRouter,
  variable: variableRouter,
  model: modelRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
