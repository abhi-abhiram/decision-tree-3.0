import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"

export const modelRouter = createTRPCRouter({
    create: publicProcedure.input(z.object({
        name: z.string(),
    })).mutation(async ({
        input: { name },
        ctx: { prisma },
    }) => {
        const model = await prisma.model.create({
            data: {
                name,
            },
        }
        );

        await prisma.variable.create({
            data: {
                name: "id",
                dataType: "String",
                id: model.primaryKeyId,
                modelId: model.id,
            }
        });

        return model;
    }),
    models: publicProcedure.query(({ ctx: { prisma } }) => {
        return prisma.model.findMany({
            orderBy: {
                createdAt: "desc",
            },
            select: {
                name: true,
                id: true,
            }
        });
    }),
    model: publicProcedure.input(z.object({
        id: z.string(),
    })).query(({ input: { id }, ctx: { prisma } }) => {
        return prisma.model.findUnique({
            where: {
                id,
            },
            include: {
                variables: true,
            }
        });
    }
    ),
    modelsWithVariables: publicProcedure.query(({ ctx: { prisma } }) => {
        const models = prisma.model.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                variables: true,
                sourceRelations: true,
                targetRelations: true,
            },

        });

        return models;
    }),

    updatePosition: publicProcedure.input(z.object({
        id: z.string(),
        positionX: z.number(),
        positionY: z.number(),
    })).mutation(({
        input: { id, positionX, positionY },
        ctx: { prisma },
    }) => {
        const model = prisma.model.update({
            where: {
                id,
            },
            data: {
                positionX,
                positionY,
            },
        }
        );

        return model;
    }
    ),

    updateName: publicProcedure.input(z.object({
        id: z.string(),
        name: z.string(),
    })).mutation(({
        input: { id, name },
        ctx: { prisma },
    }) => {
        const model = prisma.model.update({
            where: {
                id,
            },
            data: {
                name,
            },
        }
        );

        return model;
    }
    ),
})