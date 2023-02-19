import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
import type { NextApiHandler } from "next";
import { z } from 'zod'

// Required fields in body: title
// Optional fields in body: content
const bodySchema = z.object({
  title: z.string(),
  content: z.string().optional(),
})

// POST /api/post
const handler: NextApiHandler = async (req, res) => {
  const { title, content } = bodySchema.parse(req.body);

  const session = await getSession({ req });
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