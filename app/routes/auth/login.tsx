import {
  Button,
  Center,
  Container,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { AccountType } from "@prisma/client";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { GoogleReCaptcha } from "react-google-recaptcha-v3";
import { authenticator } from "~/services/auth.server";

export let action: ActionFunction = async ({ request }) => {
  // we call the method with the name of the strategy we want to use and the
  // request object, optionally we pass an object with the URLs we want the user
  // to be redirected to after a success or a failure
  return await authenticator.authenticate(
    AccountType.LOCAL.toLowerCase(),
    request,
    {
      successRedirect: "/dashboard",
      failureRedirect: "/auth/login",
    }
  );
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const errors = url.searchParams.get("errors")?.split(",");
  return { errors };
};

interface LoaderData {
  errors: string[] | undefined;
}

const Login: React.FC = () => {
  const { errors } = useLoaderData<LoaderData>();
  const onVerifyCaptcha = (token: string) => {
    // TODO: recaptcha
    // setValue("captchaToken", token);
  };

  return (
    <Form method="post">
      <Heading as="h1" textAlign={"center"}>
        Login
      </Heading>
      <Divider my={5} />
      <Container>
        <FormControl>
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input
            id="username"
            type="text"
            name="username"
            //   {...register("username", {
            //     required: "Required",
            //   })}
          />
          <FormErrorMessage>
            {/* {errors.username && errors.username.message} */}
          </FormErrorMessage>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            id="password"
            type="password"
            name="password"
            //   {...register("password", {
            //     required: "Required",
            //   })}
          />
          <FormErrorMessage>{errors}</FormErrorMessage>
        </FormControl>
        <GoogleReCaptcha onVerify={onVerifyCaptcha} />
        <Center>
          <Button
            mt={4}
            colorScheme="teal"
            //   isLoading={isSubmitting}
            type="submit"
          >
            Submit
          </Button>
        </Center>
      </Container>
    </Form>
  );
};
export default Login;
