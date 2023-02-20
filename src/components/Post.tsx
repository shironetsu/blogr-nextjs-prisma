import { Prisma } from "@prisma/client";
import Router from "next/router";
import ReactMarkdown from "react-markdown";

type Props = {
  post: Prisma.PostGetPayload<{
    include: {
      author: {
        select: { name: true };
      };
    };
  }>;
};

const Post = ({ post }: Props) => {
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <div onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}>
      <h2>{post.title}</h2>
      <small>By {authorName}</small>
      <ReactMarkdown>{post.content ?? ""}</ReactMarkdown>
      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default Post;
