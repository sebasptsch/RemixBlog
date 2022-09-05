import {
  Divider,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { AccountType, User } from "@prisma/client";
import {
  ActionFunction,
  json,
  LoaderFunction,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { authenticator } from "~/services/auth.server";
import { db } from "~/utils/db.server";

interface LoaderData {
  user: User;
  users: (User & {
    accounts: {
      provider: AccountType;
    }[];
  })[];
}

export const action: ActionFunction = async ({ request }) => {};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/login",
  });
  if (user.role !== "ADMIN") return redirect("/auth/login");
  const users = await db.user.findMany({
    include: {
      accounts: {
        select: {
          provider: true,
        },
      },
    },
  });
  return json({
    user,
    users,
  });
};

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => ({
  title: "Users",
  meta: "The admin page where you can see users.",
});

const Admin: React.FC = () => {
  const { user, users } = useLoaderData<LoaderData>();
  return (
    <>
      <Heading as="h1" textAlign={"center"}>
        Users
      </Heading>
      <Divider my={5} />
      <TableContainer>
        <Table variant={"simple"}>
          <Thead>
            <Tr>
              <Th>Username</Th>
              <Th>Role</Th>
              <Th>Created At</Th>
              <Th>Updated At</Th>
              <Th>Providers</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((userItem) => (
              <Tr key={userItem.id}>
                <Td>{userItem.name}</Td>
                <Td>{userItem.role}</Td>
                <Td>
                  {DateTime.fromISO(userItem.createdAt).toLocaleString(
                    DateTime.DATETIME_MED
                  )}
                </Td>
                <Td>
                  {DateTime.fromISO(userItem.updatedAt).toLocaleString(
                    DateTime.DATETIME_MED
                  )}
                </Td>
                <Td>
                  {userItem.accounts
                    .map((account) => account.provider)
                    .join(",")}
                </Td>
              </Tr>
            ))}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>Username</Th>
              <Th>Role</Th>
              <Th>Created At</Th>
              <Th>Updated At</Th>
              <Th>Providers</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </>
  );
};

export default Admin;
