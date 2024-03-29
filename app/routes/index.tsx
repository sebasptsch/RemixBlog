import {
  Divider,
  Heading,
  Link,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { HeadersFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Post from "~/components/Post";
import { db } from "~/utils/db.server";

export const headers: HeadersFunction = () => {
  return {
    "Cache-Control": "public, max-age=300, s-maxage=3600",
  };
};

export const meta: MetaFunction = () => ({
  title: "Seb's Blog",
  meta: "An archive and showcase of my experiences and projects.",
});

export default function Index() {
  const { posts } = useLoaderData<ReturnType<typeof loader>>();

  return (
    <>
      <Stack textAlign={"center"}>
        <Heading as="h1" textAlign={"center"}>
          Sebastian's Blog
        </Heading>
        <Text as="h2" fontSize={"2xl"}>
          An archive and showcase of my experiences and projects.
        </Text>
        <Link as={"a"} rel="me" href="https://hachyderm.io/@sebasptsch">
          Mastodon
        </Link>
      </Stack>
      <Divider my={5} />
      <SimpleGrid columns={[1, 2]} spacing={10} width="100%">
        {posts?.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </SimpleGrid>
    </>
  );
}

export const loader = async () => {
  const posts = await db.post.findMany({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      publishedAt: "desc",
    },
    select: {
      id: true,
      slug: true,
      status: true,
      publishedAt: true,
      title: true,
      summary: true,
    },
  });
  return { posts };
};
