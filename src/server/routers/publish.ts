import prisma from "../../utils/prisma";
import { protectedProcedure, router } from "../trpc";
import { z } from 'zod';

export const publishRouter = router({
    publish: protectedProcedure.input(z.object({
        id: z.string().min(1)
    })).mutation(async ({ input }) => {
        const post = await prisma.post.update({
            where : {
                id: input.id,
            },
            data: {
                published: true
            }
        })
        return post;
    })
})