import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Layout from "~/components/Layout";
import LoadingSpinner from "~/components/LoadingSpinner";

import { api } from "~/utils/api";

const Poem: NextPage<{ id: string }> = (props) => {
  console.log("page props", props);
  const { data, isLoading } = api.poems.getById.useQuery({
    id: props.id,
  });

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
                <div className="text-2xl" contentEditable={true}>
                  {data.title}
                </div>
                {data.lines.map((l, i) => (
                  <div key={i} className="py-2 text-xl" contentEditable={true}>
                    {l}
                  </div>
                ))}
                <div contentEditable={true} className="py-2 text-xl">
                  {" "}
                </div>
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
