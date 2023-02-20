import { postRouter } from "@/server/routers/post";
import { publishRouter } from "@/server/routers/publish";
import { mergeRouters } from "@/server/trpc";

export const appRouter = mergeRouters(postRouter, publishRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
