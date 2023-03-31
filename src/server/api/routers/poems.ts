import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { privateProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const poemRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    console.log("fetching all");
    return ctx.prisma.poem.findMany();
  }),
  getById: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      console.log("fetching getbyId", input);
      const poem = await ctx.prisma.poem.findFirstOrThrow({
        where: { id: input.id },
      });
      console.log("poem", poem, ctx.userId);

      if (!poem) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      if (poem.authorId !== ctx.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }

      return poem;
    }),
  fromUser: privateProcedure.query(({ ctx }) => {
    console.log("fetching fromuser");
    return ctx.prisma.poem.findMany({
      select: { id: true, title: true, createdAt: true },
      where: {
        authorId: ctx.userId,
      },
      orderBy: [{ createdAt: "desc" }],
    });
  }),
});
