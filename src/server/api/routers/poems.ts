import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { privateProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { Poem } from "@prisma/client";

function validatePoem(poem: Poem | null, userId: string): asserts poem is Poem {
  if (!poem) {
    throw new TRPCError({
      code: "NOT_FOUND",
    });
  }

  if (poem.authorId !== userId) {
    throw new TRPCError({
      code: "FORBIDDEN",
    });
  }
}

export const poemRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    console.log("fetching all");
    return ctx.prisma.poem.findMany();
  }),
  getById: privateProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const poem = await ctx.prisma.poem.findFirst({
        where: { id: input.id },
      });

      validatePoem(poem, ctx.userId);

      const lines = poem.content.split("\n");

      return { ...poem, lines };
    }),
  changeTitle: privateProcedure
    .input(z.object({ id: z.string(), title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      console.log("fetching changeTitle", input);
      const poem = await ctx.prisma.poem.findFirst({
        where: { id: input.id },
      });

      validatePoem(poem, ctx.userId);

      return ctx.prisma.poem.update({
        where: { id: input.id },
        data: { title: input.title },
      });
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
