import { TRPCError, initTRPC } from "@trpc/server";

import { Context } from "@/server/context";

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.session?.user?.email) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return next({
    //これもう少し何とかならんか？
    //こうしないと深いところにある `email` が `string` と型推論されない。
    ctx: {
      session: {
        ...ctx.session,
        user: {
          ...ctx.session.user,
          // Infers the `session.user.email` as non-nullable
          email: ctx.session.user.email,
        },
      },
    },
  });
});

export const middleware = t.middleware;
// Base router and procedure helpers
export const router = t.router;
export const mergeRouters = t.mergeRouters;
/**
 * Unprotected procedure
 */
export const publicProcedure = t.procedure;
/**
 * Protected procedure
 */
export const protectedProcedure = t.procedure.use(isAuthed);
