import { Container, Divider, Heading } from "@chakra-ui/react";
import { Post } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Descendant } from "slate";
import RichTextRenderer from "~/components/Editor/renderer";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const post = await db.post.findUniqueOrThrow({
    where: {
      slug: params.slug!,
    },
  });
  return { post };
};

interface LoaderData {
  post: Post;
}

const Post = () => {
  const { post } = useLoaderData<LoaderData>();
  return (
    <>
      <Heading as="h1" textAlign={"center"}>
        {post.title}
      </Heading>
      <Divider my={5} />
      <Container maxWidth={"container.md"}>
        <RichTextRenderer content={post.content as Descendant[]} />
      </Container>
    </>
  );
};

export default Post;
