import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Layout from "~/components/Layout";
import LoadingSpinner from "~/components/LoadingSpinner";

import { api } from "~/utils/api";

const Poem: NextPage<{ id: string }> = (props) => {
  console.log("page props", props);
  const { data, isLoading } = api.poems.getById.useQuery({
    id: "clfuudgfj0000d8htaknysfae",
  });

  return (
    <>
      <Head>
        <title>Edit poem</title>
      </Head>
      <Layout>
        {JSON.stringify(data)}
        {isLoading && <LoadingSpinner />}
        {data && (
          <div>
            <h1>{data.title}</h1>
            <p>{data.content}</p>
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
