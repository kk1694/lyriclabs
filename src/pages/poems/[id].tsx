import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Layout from "~/components/Layout";
import LoadingSpinner from "~/components/LoadingSpinner";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { api } from "~/utils/api";
import useDebounce from "../hooks";

function PoemLine(props: { text: string }) {
  const text = useRef(props.text);
  return (
    <ContentEditable
      html={text.current}
      onChange={(e) => {
        text.current = e.target.value;
      }}
    />
  );
}

const addLine = (lines: string[] | null, index: number) => {
  const newLines = lines === null ? [] : [...lines];
  newLines.splice(index + 1, 0, "");
  return newLines;
};

const editLine = (lines: string[] | null, index: number, value: string) => {
  const newLines = lines === null ? [] : [...lines];
  newLines[index] = value;
  return newLines;
};

const Poem: NextPage<{ id: string }> = (props) => {
  const [title, setTitle] = useState<string | null>(null);
  const [lines, setLines] = useState<string[] | null>(null);
  const debouncedTitle = useDebounce(title, 1000);
  const debouncedLines = useDebounce(lines, 3000);

  const { data, isFetched, isLoading } = api.poems.getById.useQuery({
    id: props.id,
  });

  useEffect(() => {
    if (isFetched && data) {
      setTitle(data.title);
      setLines(data.lines);
    }
  }, [isFetched]);

  const changeTitle = api.poems.changeTitle.useMutation();

  useEffect(() => {
    if (debouncedTitle !== null && debouncedTitle !== data?.title) {
      changeTitle.mutate({ id: props.id, title: debouncedTitle });
    }
  }, [debouncedTitle]);

  useEffect(() => {
    if (debouncedLines !== null && debouncedLines !== data?.lines) {
      console.log("lines", debouncedLines);
    }
  }, [debouncedLines]);

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
              <div className="mt-8 w-full max-w-2xl py-4">
                <textarea
                  className="w-full resize-none bg-inherit bg-red-300 text-2xl outline-none"
                  value={title || ""}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {lines &&
                  lines.map((l, i) => (
                    // <textarea
                    //   key={i}
                    //   className=" w-full resize-none content-center items-center self-center bg-blue-200 py-2 text-xl"
                    //   value={l}
                    //   onChange={(e) => editLine(i, e.target.value)}
                    //   // rows={1}
                    // />
                    // <p
                    //   key={i}
                    //   className="w-full bg-blue-300"
                    //   contentEditable={true}
                    //   onKeyDown={(e) =>
                    //     console.log("kydown", e.currentTarget.textContent)
                    //   }
                    //   suppressContentEditableWarning={true}
                    // >
                    //   {l}
                    // </p>
                    // <PoemLine key={i} text={l} />
                    <ContentEditable
                      html={l}
                      key={i}
                      onChange={(e) => {
                        setLines((lines) => editLine(lines, i, e.target.value));
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          setLines((lines) => addLine(lines, i));
                        }
                      }}
                    />
                  ))}

                <div className="py-2 text-xl"> </div>
              </div>
            </div>
            <div className="flex h-[30%] justify-center">
              <textarea
                className="h-full w-full max-w-4xl border-2 border-dotted border-slate-600 text-lg outline-none focus:border-solid"
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
