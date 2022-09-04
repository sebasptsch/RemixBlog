import {
  Button,
  ButtonGroup,
  Container,
  Divider,
  Heading,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";
import { User } from "@prisma/client";
import { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { DateTime } from "luxon";
import { authenticator } from "~/services/auth.server";
import { db } from "~/utils/db.server";

interface LoaderData {
  user: User;
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/login",
  });
  return {
    user,
  };
};

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/login",
  });
  try {
    await db.user.delete({ where: { id: user.id } });
  } catch (error) {
    console.log("error");
  } finally {
    return authenticator.logout(request, { redirectTo: "/auth/login" });
  }
};

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => ({
  title: "Profile",
});

const Profile: React.FC = () => {
  const { user } = useLoaderData<LoaderData>();
  return (
    <>
      <Heading as="h1" textAlign={"center"}>
        My Account
      </Heading>
      <Divider my={5} />
      <Container maxW="md">
        <StatGroup>
          <Stat>
            <StatLabel>Account Created</StatLabel>
            <StatNumber>
              {DateTime.fromISO(user.createdAt).toRelativeCalendar()}
            </StatNumber>
          </Stat>

          <Stat>
            <StatLabel>Account Last Updated</StatLabel>
            <StatNumber>
              {DateTime.fromISO(user.updatedAt).toRelativeCalendar()}
            </StatNumber>
          </Stat>
        </StatGroup>
      </Container>

      <ButtonGroup as={Form} method="post" alignItems={"center"} w="100%">
        <Button colorScheme="red" type="submit">
          Delete Account
        </Button>
      </ButtonGroup>
    </>
  );
};
export default Profile;
