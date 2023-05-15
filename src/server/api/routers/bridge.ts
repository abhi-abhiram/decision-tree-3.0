import { ZCreateBridgeNodeInput, ZUpdateBridgeNodeInput } from "~/zodObjs/bridgeNode"
import { publicProcedure, createTRPCRouter } from "../trpc"


export const bridgeRouter = createTRPCRouter({
    createBridgeNode: publicProcedure.input(ZCreateBridgeNodeInput).mutation(({
        ctx: { prisma },
        input
    }) => {
        const createBridgeNode = prisma.bridgeNode.create({
            data: {
                name: input.name,
                parentId: input.parentId,
                fromTreeId: input.fromTreeId,
                toTreeId: input.toTreeId,

            }
        })

        return createBridgeNode
    }),

    updateBridgeNode: publicProcedure.input(ZUpdateBridgeNodeInput).mutation(({
        ctx: { prisma },
        input
    }) => {
        const updateBridgeNode = prisma.bridgeNode.update({
            where: {
                id: input.id
            },
            data: {
                name: input.name,
                parentId: input.parentId,
                fromTreeId: input.fromTreeId,
                toTreeId: input.toTreeId,
            }
        })

        return updateBridgeNode
    }
    ),

    deleteBridgeNode: publicProcedure.input(ZUpdateBridgeNodeInput).mutation(({
        ctx: { prisma },
        input
    }) => {
        const deleteBridgeNode = prisma.bridgeNode.delete({
            where: {
                id: input.id
            }
        })

        return deleteBridgeNode
    }
    ),
})

