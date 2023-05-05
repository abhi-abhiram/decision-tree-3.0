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
                        ,

                    } : {}
                ),
            }
        })

        return tree
    }),

    get: publicProcedure.input(z.object({
        id: z.string()
    })).query(async ({ ctx, input }) => {
        const tree = await ctx.prisma.tree.findUnique({
            where: {
                id: input.id
            },
            include: {
                nodes: true
            }
        })



        if (tree?.nodes.length === 0) {
            const newNode = await ctx.prisma.node.create({
                data: {
                    name: "Root",
                    treeId: tree.id,
                    type: "SingleInput",
                    question: "Root",
                    Tree: {
                        connect: {
                            id: tree.id
                        }
                    }
                },

            }
            )

            tree.nodes.push(newNode)

            tree.rootNodeId = newNode.id

            await ctx.prisma.tree.update({
                where: {
                    id: tree.id
                },
                data: {
                    rootNodeId: newNode.id
                }
            })
        }

        return tree
    }
    ),
})