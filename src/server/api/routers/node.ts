import { ZCreateNodeInput, ZUpdateNodeInput } from "~/zodObjs/node";
import { publicProcedure, createTRPCRouter } from "../trpc";
import { z } from "zod";

export const nodeRouter = createTRPCRouter({
    create: publicProcedure.input(ZCreateNodeInput).mutation(async ({ ctx, input: { child, ...input } }) => {



        const node = await ctx.prisma.node.create({
            data: {
                ...input,
            }
        }
        )

        if (child) {
            await ctx.prisma.node.update({
                where: {
                    id: child
                },
                data: {
                    parentId: node.id
                }
            })
        }
        return node
    }),

    update: publicProcedure.input(ZUpdateNodeInput).mutation(async ({ ctx, input }) => {
        const node = await ctx.prisma.node.update({
            where: {
                id: input.id
            },
            data: {
                ...input
            }
        })

        return node
    }
    ),

    delete: publicProcedure.input(ZUpdateNodeInput).mutation(async ({ ctx, input }) => {
        const node = await ctx.prisma.node.delete({
            where: {
                id: input.id
            }
        })

        return node
    }
    ),

    getSingleChild: publicProcedure.input(z.object({
        id: z.string()
    })).query(async ({ ctx, input }) => {
        let node = await ctx.prisma.node.findFirst({
            where: {
                parentId: input.id
            },
            include: {
                options: true,
                _count: {
                    select: {
                        children: true,
                        bridgeNodes: true
                    }
                },
                vars: true

            }
        })

        if (!node) {
            node = (await ctx.prisma.bridgeNode.findFirst({
                where: {
                    parentId: input.id
                },
                select: {
                    toTree: {
                        select: {
                            rootNode: {
                                include: {
                                    options: true,
                                    _count: {
                                        select: {
                                            children: true,
                                            bridgeNodes: true
                                        },
                                    },
                                    vars: true
                                }
                            }
                        }
                    }
                }
            }
            ))?.toTree.rootNode ?? null;
        }

        return node
    }
    ),

    get: publicProcedure.input(z.object({
        id: z.string()
    })).query(async ({ ctx, input }) => {
        const node = await ctx.prisma.node.findUnique({
            where: {
                id: input.id
            },
            include: {
                options: true,
                _count: {
                    select: {
                        children: true,
                        bridgeNodes: true
                    }
                },
                vars: true

            }
        })

        return node
    }
    ),

})