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
                folderId: input.folderId
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
                nodes: {
                    include: {
                        vars: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                },
                bridgeNodes: true,
            }
        })



        if (tree?.nodes.length === 0) {
            const newNode = await ctx.prisma.node.create({
                data: {
                    name: "Root",
                    treeId: tree.id,
                    type: "SingleInput",
                    question: "Root",
                },
                include: {
                    vars: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                }

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

    onlyTree: publicProcedure.input(z.object({
        id: z.string()
    })).query(async ({ ctx, input }) => {
        const tree = await ctx.prisma.tree.findUnique({
            where: {
                id: input.id
            },
            include: {
                rootNode: {
                    include: {
                        options: true,
                        _count: {
                            select: {
                                children: true
                            }
                        }

                    }
                }
            }
        })

        return tree
    }
    ),

    getRootNode: publicProcedure.input(z.object({
        id: z.string()
    })).query(async ({ ctx, input }) => {
        const rootNode = await ctx.prisma.tree.findUnique({
            where: {
                id: input.id
            },
            select: {
                rootNode: {
                    include: {
                        options: true,
                        _count: {
                            select: {
                                children: true
                            }
                        }

                    }
                }
            }

        })

        if (!rootNode?.rootNode) {
            throw new Error("No root node found")
        }

        return rootNode.rootNode;
    }
    ),

    delete: publicProcedure.input(z.object({
        id: z.string()
    })).mutation(async ({ ctx, input }) => {
        const tree = await ctx.prisma.tree.delete({
            where: {
                id: input.id
            }
        })

        return tree
    }
    ),
})