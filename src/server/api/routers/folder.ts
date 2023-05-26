import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const folderRouter = createTRPCRouter({
    create: publicProcedure.input(z.object({ name: z.string(), workspaceId: z.string(), parentId: z.string().optional() })).mutation(async ({ ctx, input }) => {
        const folder = await ctx.prisma.folder.create({ data: { name: input.name, workspaceId: input.workspaceId, parentId: input.parentId } })

        return folder
    }),
    open: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
        const folder = await ctx.prisma.folder.findUnique({
            where: { id: input.id },
            select: {
                trees: true,
                children: true,
            }
        },

        )

        if (!folder) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Folder not found' })
        }


        const foldersAndTrees = [...folder?.children, ...folder?.trees].sort((a, b) => {
            return b.updatedAt.getTime() - a.updatedAt.getTime()
        }
        )

        return foldersAndTrees
    }),
    delete: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
        const folder = await ctx.prisma.folder.delete({ where: { id: input.id } })

        return folder
    }
    ),
})