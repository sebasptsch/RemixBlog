import {
  Button,
  Divider,
  Flex,
  Heading,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { DraftStatus, Post, User } from "@prisma/client";
import {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import PostMenu from "~/components/PostMenu";
import { authenticator } from "~/services/auth.server";
import { db } from "~/utils/db.server";

interface LoaderData {
  user: User;
  posts: {
    id: number;
    title: string;
    slug: string;
    status: DraftStatus;
    publishedAt: Date;
  }[];
}

export const action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();
  let id = formData.get("id");
  if (typeof id !== "string") throw new Error("Incorrect format");
  let action = formData.get("action");
  if (typeof action !== "string") throw new Error("Incorrect format");
  const post = await db.post.findUniqueOrThrow({ where: { id: parseInt(id) } });

  let resultPost: Post | null = null;
  switch (action) {
    case "status":
      resultPost = await db.post.update({
        where: { id: parseInt(id) },
        data: {
          status:
            post.status === DraftStatus.DRAFT
              ? DraftStatus.PUBLISHED
              : DraftStatus.DRAFT,
        },
      });
      break;
    case "delete":
      resultPost = await db.post.delete({ where: { id: parseInt(id) } });
      break;
    default:
      console.log(action);
  }
  return resultPost;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/login",
  });
  if (user.role !== "ADMIN") return redirect("/auth/login");
  const posts = await db.post.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      publishedAt: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
  });
  return {
    user,
    posts,
  };
};

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => ({
  title: "Admin",
});

const Admin: React.FC = () => {
  const { user, posts } = useLoaderData<LoaderData>();
  return (
    <>
      <Heading as="h1" textAlign={"center"}>
        Admin Dashboard
      </Heading>
      <Divider my={5} />
      <Flex justifyContent={"center"}>
        <Button as={Link} to={`/posts/create`}>
          New Post
        </Button>
      </Flex>
      {/* <PostCreationDrawer /> */}
      <TableContainer>
        <Table variant={"simple"}>
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Slug</Th>
              <Th>Status</Th>
              <Th isNumeric>Menu</Th>
            </Tr>
          </Thead>
          <Tbody>
            {!!posts?.length ? (
              posts.map((post) => (
                <Tr key={post.id}>
                  <Td>
                    <Link to={`/posts/${post.slug}`}>{post.title}</Link>
                  </Td>
                  <Td>{post.slug}</Td>
                  <Td>
                    <Tag
                      colorScheme={post.status === "DRAFT" ? "blue" : "green"}
                    >
                      {post.status}
                    </Tag>
                  </Td>
                  <Td isNumeric>
                    <PostMenu post={post} />
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td>No Posts Yet</Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
              </Tr>
            )}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>Title</Th>
              <Th>Slug</Th>
              <Th>Status</Th>
              <Th isNumeric>Menu</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </>
  );
};

export default Admin;
