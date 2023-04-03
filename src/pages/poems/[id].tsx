import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import Layout from "~/components/Layout";
import LoadingSpinner from "~/components/LoadingSpinner";

import { api } from "~/utils/api";
import useDebounce from "../hooks";

const Poem: NextPage<{ id: string }> = (props) => {
  const [title, setTitle] = useState<string | null>(null);
  const debouncedTitle = useDebounce(title, 1000);

  const { data, isFetched, isLoading } = api.poems.getById.useQuery({
    id: props.id,
  });

  useEffect(() => {
    if (isFetched && data) {
      setTitle(data.title);
    }
  }, [isFetched]);

  const changeTitle = api.poems.changeTitle.useMutation();

  useEffect(() => {
    if (debouncedTitle !== null && debouncedTitle !== data?.title) {
      changeTitle.mutate({ id: props.id, title: debouncedTitle });
    }
  }, [debouncedTitle]);

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
                <input
                  className="w-full bg-inherit text-2xl outline-none"
                  value={title || ""}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {data.lines.map((l, i) => (
                  <div key={i} className="py-2 text-xl">
                    {l}
                  </div>
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
