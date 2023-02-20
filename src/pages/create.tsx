import { useState } from "react";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";

const useSubmitData = () => {
  const mutation = trpc.postCreate.useMutation();
  const router = useRouter();
  return async ({ title, content }: { title: string; content: string }) => {
    try {
      mutation.mutateAsync({ title, content }).then(() => {
        router.push("/drafts");
      });
    } catch (error) {
      console.error(error);
    }
  };
};

const Draft = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const submitData = useSubmitData();
  const router = useRouter();

  return (
    <Layout>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitData({ title, content });
          }}
        >
          <h1>New Draft</h1>
          <input
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
          />
          <textarea
            cols={50}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            rows={8}
            value={content}
          />
          <input disabled={!content || !title} type="submit" value="Create" />
          <a className="back" href="#" onClick={() => router.push("/")}>
            or Cancel
          </a>
        </form>
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        input[type="text"],
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type="submit"] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Draft;
