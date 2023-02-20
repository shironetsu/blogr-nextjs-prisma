import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import ReactMarkdown from "react-markdown";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import prisma from "../../utils/prisma";
import { trpc } from "../../utils/trpc";

export const getServerSideProps = async ({
  params,
}: GetServerSidePropsContext) => {
  const post = await prisma.post.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });
  if (post === null) {
    return {
      notFound: true,
    };
  }
  return {
    props: post,
  };
};

const usePublishPost = () => {
  const mutation = trpc.publish.useMutation();
  const router = useRouter();
  return (id: string) => {
    mutation
      .mutateAsync({ id })
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        console.error(error);
      });
  };
};

const useDeletePost = () => {
  const mutation = trpc.postDelete.useMutation();
  const router = useRouter();
  return (id: string) => {
    mutation
      .mutateAsync({ id })
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        console.error(error);
      });
  };
};

const Post = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { data: session, status } = useSession();
  const publishPost = usePublishPost();
  const deletePost = useDeletePost();

  if (status === "loading") {
    return <div>Authenticating ...</div>;
  }

  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.author?.email;
  let title = props.title;
  if (!props.published) {
    title = `${title} (Draft)`;
  }

  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>By {props?.author?.name || "Unknown author"}</p>
        <ReactMarkdown>{props.content ?? ""}</ReactMarkdown>
        {!props.published && userHasValidSession && postBelongsToUser && (
          <button onClick={() => publishPost(props.id)}>Publish</button>
        )}
        {userHasValidSession && postBelongsToUser && (
          <button onClick={() => deletePost(props.id)}>Delete</button>
        )}
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Post;
