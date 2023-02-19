import type { NextApiHandler } from "next";
import prisma from "../../../lib/prisma";
import { z } from 'zod'

const querySchema = z.object({
  id: z.string().min(1)
})

// DELETE /api/post/:id
const handler: NextApiHandler = async (req, res) => {
  const { id: postId } = querySchema.parse(req.query)
  if (req.method === "DELETE") {
    const post = await prisma.post.delete({
      where: { id: postId },
    });
    res.json(post);
  } else {
    throw new Error(
      `The HTTP ${req.method} method is not supported at this route.`
    );
  }
}

export default handler