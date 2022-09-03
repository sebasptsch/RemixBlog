import { Button, ButtonGroup, ButtonProps } from "@chakra-ui/react";
import { Form } from "@remix-run/react";

const SocialButton: React.FC<
  ButtonProps & { provider: "github" | "discord" }
> = ({ provider, ...buttonProps }) => (
  <Form method="post" action={`/auth/${provider}`}>
    <Button {...buttonProps} type="submit" />
  </Form>
);

const Login: React.FC = () => {
  return (
    <ButtonGroup>
      <SocialButton provider="discord">Discord</SocialButton>
      <SocialButton provider="github">Github</SocialButton>
    </ButtonGroup>
  );
};
export default Login;
