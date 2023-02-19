import { getServerSession } from "next-auth/next";
import prisma from "../../../utils/prisma";
import type { NextApiHandler } from "next";
import { z } from 'zod'
import { authOptions } from "../auth/[...nextauth]";

// Required fields in body: title
// Optional fields in body: content
const bodySchema = z.object({
  title: z.string(),
  content: z.string().optional(),
})

// POST /api/post
const handler: NextApiHandler = async (req, res) => {
  const { title, content } = bodySchema.parse(req.body);

  const session = await getServerSession(req, res, authOptions)
  const result = await prisma.post.create({
    data: {
      title: title,
      content: content,
      author: { connect: { email: session?.user?.email ?? undefined } },
    },
  });
  res.json(result);
}

export default handler