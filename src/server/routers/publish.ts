import { z } from "zod";

import { protectedProcedure, router } from "@/server/trpc";
import prisma from "@/utils/prisma";

export const publishRouter = router({
  publish: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const post = await prisma.post.update({
        where: {
          id: input.id,
        },
        data: {
          published: true,
        },
      });
      return post;
    }),
});
