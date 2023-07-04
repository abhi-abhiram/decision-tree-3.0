import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"

export const modelRouter = createTRPCRouter({
    create: publicProcedure.input(z.object({
        name: z.string(),
    })).mutation(({
        input: { name },
        ctx: { prisma },
    }) => {
        const model = prisma.model.create({
            data: {
                name,
            },
        }
        );

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
    })
})