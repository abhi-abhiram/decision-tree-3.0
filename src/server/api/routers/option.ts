import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { ZCreateOptionInput, ZUpdateOptionInput } from "~/zodObjs/option";

export const optionRouter = createTRPCRouter({
    create: publicProcedure.input(ZCreateOptionInput).mutation(async ({ ctx, input }) => {



        const option = await ctx.prisma.option.create({
            data: {
                ...input,
            }
        }
        )

        return option
    }
    ),

    update: publicProcedure.input(ZUpdateOptionInput).mutation(async ({ ctx, input }) => {
        const option = await ctx.prisma.option.update({
            where: {
                id: input.id
            },
            data: {
                ...input
            }
        })

        return option
    }
    ),

    options: publicProcedure.input(z.object(
        {
            id: z.string()
        }
    )).query(async ({ ctx, input }) => {
        const options = await ctx.prisma.option.findMany({
            where: {
                nodeId: input.id
            }
        })

        return options
    }
    ),

    delete: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
        const option = await ctx.prisma.option.delete({
            where: {
                id: input
            }
        })

        return option
    }
    ),

})