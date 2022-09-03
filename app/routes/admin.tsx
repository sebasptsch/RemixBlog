import {
  Divider,
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
import { DraftStatus, User } from "@prisma/client";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
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

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
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
      publishedAt: "asc",
    },
  });
  return {
    user,
    posts,
  };
};

const Admin: React.FC = () => {
  const { user, posts } = useLoaderData<LoaderData>();
  return (
    <>
      <Heading as="h1" textAlign={"center"}>
        Admin Dashboard
      </Heading>
      <Divider my={5} />
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
                  <Td>{post.title}</Td>
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
