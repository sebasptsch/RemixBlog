import { Heading, LinkBox, Tag, Text } from "@chakra-ui/react";
import { DraftStatus } from "@prisma/client";
import { Link } from "@remix-run/react";
import { DateTime } from "luxon";

// interface Post {
//   id: number;
//   status: "PUBLISHED" | "DRAFT";
//   slug: string;
//   title: string;
//   summary: string;
//   content: object;
//   userId: number;
//   createdAt: string;
//   updatedAt: string;
//   publishedAt: string;
// }

interface MinimalPost {
  slug: string;
  status: DraftStatus;
  publishedAt: string;
  title: string;
  summary: string;
}

export const PostItem: React.FC<{ post: MinimalPost }> = ({ post }) => {
  return (
    <LinkBox
      as={Link}
      m={2}
      borderWidth="1px"
      borderRadius="lg"
      p={5}
      prefetch="intent"
      to={`/posts/${post.slug}`}
    >
      {DateTime.fromISO(post.publishedAt).toRelativeCalendar()}
      {post.status === "PUBLISHED" ? null : <Tag>{post.status}</Tag>}
      <Heading size="md" my={2}>
        {post.title}
      </Heading>
      <Text>{post.summary}</Text>
    </LinkBox>
  );
};
export default PostItem;
