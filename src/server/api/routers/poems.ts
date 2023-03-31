import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { privateProcedure } from "../trpc";

export const poemRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.poem.findMany();
  }),
  fromUser: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.poem.findMany({
      where: {
        authorId: ctx.userId,
      },
      orderBy: [{ createdAt: "desc" }],
    });
  }),
});
