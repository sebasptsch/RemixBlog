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

import {
  GoogleReCaptcha,
  GoogleReCaptchaProvider,
} from "react-google-recaptcha-v3";

const Register: React.FC = () => {
  const onVerifyCaptcha = (token: string) => {
    // TODO: recaptcha
    // setValue("captchaToken", token);
  };

  return (
    <>
      <GoogleReCaptchaProvider
        reCaptchaKey="6Lf6ne4fAAAAAD7JmLtcYowY6XjCLTL38HKSY9Rb"
        scriptProps={{
          async: false, // optional, default to false,
          defer: false, // optional, default to false
          appendTo: "body", // optional, default to "head", can be "head" or "body",
          nonce: undefined, // optional, default undefined
        }}
      >
        <Heading as="h1" textAlign={"center"}>
          Register
        </Heading>
        <Divider my={5} />
        <Container>
          <FormControl>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              id="username"
              type="text"
              // {...register("username", {
              //   required: "Required",
              // })}
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
              // {...register("password", {
              //   required: "Required",
              // })}
            />
            <FormErrorMessage>
              {/* {errors.password && errors.password.message} */}
            </FormErrorMessage>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Confirm Password</FormLabel>
            <Input
              id="password"
              type="password"
              // {...register("passwordconfirm", {
              //   required: "Required",
              //   validate: (value) =>
              //     getValues("password") === value || "Passwords do not match",
              // })}
            />
            <FormErrorMessage>
              {/* {!!errors.passwordconfirm && errors.passwordconfirm.message} */}
            </FormErrorMessage>
          </FormControl>
          <GoogleReCaptcha onVerify={onVerifyCaptcha} />
          <Center>
            <Button
              mt={4}
              colorScheme="teal"
              // isLoading={isSubmitting}
              type="submit"
            >
              Submit
            </Button>
          </Center>
        </Container>
      </GoogleReCaptchaProvider>
    </>
  );
};

export default Register;
