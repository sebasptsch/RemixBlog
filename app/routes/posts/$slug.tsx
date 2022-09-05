import { Container, Divider, Heading } from "@chakra-ui/react";
import { Post } from "@prisma/client";
import { HeadersFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Descendant } from "slate";
import RichTextRenderer from "~/components/Editor/renderer";
import { authenticator } from "~/services/auth.server";
import { db } from "~/utils/db.server";

export const headers: HeadersFunction = () => {
  return {
    "Cache-Control": "max-age=300, s-maxage=3600",
  };
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request);
  const post = await db.post.findUniqueOrThrow({
    where: {
      slug: params.slug!,
    },
  });
  if (
    (post.status === "DRAFT" && post.userId === user?.id) ||
    post.status === "PUBLISHED"
  )
    return { post };
  throw new Error("Access Forbidden");
};

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => {
  return {
    title: `${data.post.title} | Seb's Blog`,
    description: `${data.post.summary}`,
  };
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
