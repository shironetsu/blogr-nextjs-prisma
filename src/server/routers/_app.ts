import { z } from "zod";
import { publicProcedure, router, mergeRouters } from "../trpc";
import { postRouter } from "./post";
import { publishRouter } from "./publish";

export const appRouter = mergeRouters(postRouter, publishRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
