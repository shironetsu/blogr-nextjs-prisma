import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext({ req, res }: CreateNextContextOptions) {
  const session = await getServerSession(req, res, authOptions);

  return {
    session,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
