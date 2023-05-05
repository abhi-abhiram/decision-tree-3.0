import { createTRPCRouter, publicProcedure } from "../trpc";
import { ZCreateOptionInput, ZUpdateOptionInput } from "~/zodObjs/option";

export const optionRouter = createTRPCRouter({
    create: publicProcedure.input(ZCreateOptionInput).mutation(async ({ ctx, input }) => {

        const logic = input.logicId ? input.logicId :
            (await ctx.prisma.logic.create({
                data: {
                    nodeId: input.nodeId,
                },
                select: {
                    id: true,
                }

            })).id;



        const option = await ctx.prisma.option.create({
            data: {
                ...input,
                logicId: logic,
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

})