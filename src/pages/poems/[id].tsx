import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import Layout from "~/components/Layout";
import LoadingSpinner from "~/components/LoadingSpinner";

import { api } from "~/utils/api";
import useDebounce from "../hooks";

const textAreaLines = (text: string, cols = 20) => {
  let linecount = 0;
  text.split("\n").forEach((line) => {
    linecount += Math.ceil(line.length / cols) || 1;
  });
  console.log(text, linecount);
  return linecount;
};

const Poem: NextPage<{ id: string }> = (props) => {
  const [content, setContent] = useState<string | null>(null);
  const [lineCount, setLineCount] = useState(0);

  const debouncedContent = useDebounce(content, 1000);

  const { data, isFetched, isLoading } = api.poems.getById.useQuery({
    id: props.id,
  });

  useEffect(() => {
    if (isFetched && data) {
      setContent(data.content);
      setLineCount(textAreaLines(data.content));
    }
  }, [isFetched]);

  const changeContent = api.poems.changeContent.useMutation();

  useEffect(() => {
    if (debouncedContent !== null && debouncedContent !== data?.content) {
      changeContent.mutate({ id: props.id, content: debouncedContent });
    }
  }, [debouncedContent]);

  return (
    <>
      <Head>
        <title>Edit poem</title>
      </Head>
      <Layout>
        {isLoading && <LoadingSpinner />}
        {data && (
          <div className="h-full">
            <div className="flex h-[70%] w-full justify-center ">
              <div className="my-2 w-full max-w-2xl overflow-y-scroll rounded bg-slate-100 p-4">
                {/* <input
                  className="my-3 w-full bg-inherit text-2xl outline-none"
                  value={title || ""}
                  onChange={(e) => setTitle(e.target.value)}
                /> */}
                {content !== null && (
                  <textarea
                    className="md:text-md resize-none whitespace-pre-wrap bg-inherit text-sm outline-none lg:text-xl"
                    value={content}
                    cols={48}
                    onChange={(e) => {
                      setContent(e.target.value);
                      setLineCount(
                        textAreaLines(e.target.value, e.target.cols)
                      );
                    }}
                    rows={lineCount + 2}
                  />
                )}
                <div className="py-2 text-xl"> </div>
              </div>
            </div>
            <div className="flex h-[30%] justify-center">
              <textarea
                className="h-full w-full max-w-4xl rounded border-2 border-dotted border-slate-600 p-4 text-lg outline-none focus:border-solid"
                autoFocus
              />
            </div>
          </div>
        )}
      </Layout>
    </>
  );
};

// import { createProxySSGHelpers } from "@trpc/react-query/ssg";
// import { appRouter } from "~/server/api/root";
// import { prisma } from "~/server/db";
// import superjson from "superjson";

export const getStaticProps: GetStaticProps = (context) => {
  // const ssg = createProxySSGHelpers({
  //   router: appRouter,
  //   ctx: { prisma, userId: null },
  //   transformer: superjson, // optional - adds superjson serialization
  // });

  const id = context.params?.id;

  console.log("prefetch id", id, context.params);

  if (typeof id !== "string") {
    throw new Error("No id!");
  }

  // await ssg.poems.getById.prefetch({ id });

  return {
    props: {
      // trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default Poem;
