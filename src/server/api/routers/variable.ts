import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { RelationType, VarDataType, VarOperator } from "@prisma/client";

export const variableRouter = createTRPCRouter({
    create: publicProcedure.input(z.object({
        name: z.string(),
        modelId: z.string(),
        dataType: z.nativeEnum(VarDataType),
        relation: z.object({
            isForeignKey: z.boolean(),
            targetId: z.string(),
            type: z.nativeEnum(RelationType),
            name: z.string()
        }).optional()
    })).mutation(async ({ input, ctx }) => {
        const variable = await ctx.prisma.variable.create({
            data: {
                name: input.name,
                modelId: input.modelId,
                dataType: input.dataType,
                isForeignKey: input.relation?.isForeignKey,

            }
        })
        if (input.relation) {
            await ctx.prisma.relation.create({
                data: {
                    type: input.relation.type,
                    sourceId: input.modelId,
                    targetId: input.relation.targetId,
                    varId: variable.id,
                    name: input.relation.name

                }
            })
        }

        return variable;
    }),

    update: publicProcedure.input(z.object({
        id: z.string(),
        name: z.string().optional(),
        operator: z.nativeEnum(VarOperator).optional(),
    })).mutation(async ({ input, ctx }) => {
        const vairable = await ctx.prisma.variable.update({
            where: {
                id: input.id
            },
            data: {
                name: input.name,
                operator: input.operator
            }
        })
        return vairable
    }),

    connectNode: publicProcedure.input(z.object({
        variableId: z.string(),
        nodeId: z.string(),
    })).mutation(async ({ input, ctx }) => {
        const variable = await ctx.prisma.variable.update({
            where: {
                id: input.variableId
            },
            data: {
                nodes: {
                    connect: {
                        id: input.nodeId
                    }
                }
            }
        })
        return variable
    }
    ),

    disconnectNode: publicProcedure.input(z.object({
        variableId: z.string(),
        nodeId: z.string(),
    })).mutation(async ({ input, ctx }) => {
        const variable = await ctx.prisma.variable.update({
            where: {
                id: input.variableId
            },
            data: {
                nodes: {
                    disconnect: {
                        id: input.nodeId
                    }
                }
            }
        })
        return variable
    }
    ),

    getAllVariablesByTreeId: publicProcedure.input(z.object({
        treeId: z.string(),
    })).query(async ({ input, ctx }) => {
        const variables = await ctx.prisma.variable.findMany({
            where: {
                treeId: input.treeId,

            },
            orderBy: {
                updatedAt: "desc"
            }
        })
        return variables
    }
    ),

    getVariableById: publicProcedure.input(z.object({
        id: z.string(),
    })).query(async ({ input, ctx }) => {
        const variable = await ctx.prisma.variable.findUnique({
            where: {
                id: input.id
            },
            include: {
                nodes: true
            }
        })
        return variable
    }
    ),
})