import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Configuration, OpenAIApi } from "openai";
import { env } from "~/env.mjs";

const configuration = new Configuration({
  organization: "org-v62k2CvNV5MHgdDqgZLbNlHt",
  apiKey: env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return { abhiram: "dafds" };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return { abhiram: "dafds" };
  }),
});
