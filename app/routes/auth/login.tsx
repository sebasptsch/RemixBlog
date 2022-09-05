import { Button, ButtonGroup, ButtonProps } from "@chakra-ui/react";
import { HeadersFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";

export const headers: HeadersFunction = () => {
  return {
    "Cache-Control": "max-age=300, s-maxage=3600",
  };
};

const SocialButton: React.FC<
  ButtonProps & { provider: "github" | "discord" }
> = ({ provider, ...buttonProps }) => (
  <Form method="post" action={`/auth/${provider}`}>
    <Button {...buttonProps} type="submit" />
  </Form>
);

export const loader: LoaderFunction = ({ request }) =>
  authenticator.isAuthenticated(request, { successRedirect: "/profile" });

export const meta: MetaFunction = ({}) => ({
  title: "Login",
  meta: "The login page.",
});

const Login: React.FC = () => {
  return (
    <ButtonGroup>
      <SocialButton provider="discord">Discord</SocialButton>
      <SocialButton provider="github">Github</SocialButton>
    </ButtonGroup>
  );
};
export default Login;
