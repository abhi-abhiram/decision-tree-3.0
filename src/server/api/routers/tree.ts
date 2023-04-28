import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const treeRouter = createTRPCRouter({
    create: publicProcedure.input(z.object({
        name: z.string(),
        folderId: z.string().optional(),
        workspaceId: z.string()
    })).mutation(async ({ ctx, input }) => {

        const tree = await ctx.prisma.tree.create({
            data: {
                name: input.name,
                workspaceId: input.workspaceId,
                ...(
                    input.folderId ? {
                        folders: {
                            connect: {
                                id: input.folderId
                            }
                        }
                    } : {}
                )
            }
        })

        return tree
    })
})