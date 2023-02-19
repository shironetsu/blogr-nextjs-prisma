import { TRPCError } from "@trpc/server";
import prisma from "../../utils/prisma";
import { protectedProcedure, router } from "../trpc";
import { z } from 'zod'

export const postRouter = router({
    postCreate: protectedProcedure.input(z.object({
        title: z.string(),
        content: z.string().optional(),
    })).mutation(async ({ input, ctx }) => {
        const result = await prisma.post.create({
            data: {
                title: input.title,
                content: input.content,
                author: {
                    connect: {
                        email: ctx.session.user.email,
                    }
                }
            }
        });
        return result;
    }),
    postDelete: protectedProcedure.input(z.object({
        id: z.string().min(1),
    })).mutation(async ({ input, ctx }) => {
        // `delete` はキーを指定する必要あり。
        // `deleteMany` は一斉操作のため、トランザクションが張られる。
        // https://www.prisma.io/docs/guides/performance-and-optimization/prisma-client-transactions-guide#bulk-operations
        const result = await prisma.post.deleteMany({
            where: {
                id: input.id,
                author: {
                    //userIdを指定したいところ。
                    email: ctx.session.user.email,
                }
            },
        });
        if(result.count === 0){
            throw new TRPCError({
                code: 'NOT_FOUND',
            })
        }
    }),
})