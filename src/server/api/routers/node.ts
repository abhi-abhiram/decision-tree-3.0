import { ZCreateNodeInput, ZUpdateNodeInput } from "~/zodObjs/node";
import { publicProcedure, createTRPCRouter } from "../trpc";

export const nodeRouter = createTRPCRouter({
    create: publicProcedure.input(ZCreateNodeInput).mutation(async ({ ctx, input }) => {
        const node = await ctx.prisma.node.create({
            data: {
                ...input,
                Tree: {
                    connect: {
                        id: input.treeId
                    }
                }
            }
        }
        )

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
})