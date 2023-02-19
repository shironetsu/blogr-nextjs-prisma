import { NextApiHandler } from "next";
import prisma from "../../../lib/prisma";
import { z } from 'zod'

const querySchema = z.object({
  id: z.string().min(1),
})

// PUT /api/publish/:id
const handler: NextApiHandler = async (req, res) => {
  const { id: postId } = querySchema.parse(req.query);
  const post = await prisma.post.update({
    where: { id: postId },
    data: { published: true },
  });
  res.json(post);
}

export default handler