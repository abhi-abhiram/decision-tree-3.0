import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { type Folder, type Tree } from "@prisma/client";


export const workspaceRouter = createTRPCRouter({
    create: publicProcedure.input(z.object({
        name: z.string(),
    })).mutation(async ({ ctx, input }) => {
        const workspace = await ctx.prisma.workspace.create({
            data: {
                name: input.name,
            }
        })

        return workspace
    }),

    workspaces: publicProcedure.query(async ({ ctx }) => {
        const workspaces = await ctx.prisma.workspace.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })
        return workspaces
    }),

    foldersAndTrees: publicProcedure.input(z.object({
        workspaceId: z.string(),
    })).query(async ({ ctx, input }) => {
        const folders = await ctx.prisma.folder.findMany({
            where: {
                workspaceId: input.workspaceId,
                parentId: null
            },
            orderBy: {
                updatedAt: 'desc'
            }
        }
        )


        const trees = await ctx.prisma.tree.findMany({
            where: {
                workspaceId: input.workspaceId,
                folderId: null
            },
            orderBy: {
                updatedAt: 'desc'
            }
        })


        const foldersAndTrees = [...folders, ...trees].sort((a, b) => {
            return b.updatedAt.getTime() - a.updatedAt.getTime()
        }
        )



        return {
            foldersAndTrees: foldersAndTrees,
        }
    }),

    getWorkspace: publicProcedure.input(z.object({
        workspaceId: z.string(),
    })).query(async ({ ctx, input }) => {
        const workspace = await ctx.prisma.workspace.findUnique({
            where: {
                id: input.workspaceId
            }
        })

        return workspace
    }
    ),

})