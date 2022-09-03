import {
  ButtonGroup,
  Container,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useLoaderData } from "@remix-run/react";
import { FaGithub, FaTwitter } from "react-icons/fa";
// import Logo from "../logo.svg";

export const Footer: React.FC = () => {
  const date = useLoaderData<string>();
  return (
    <Container
      as="footer"
      role="contentinfo"
      py={{ base: "12", md: "16" }}
      maxWidth={"container.md"}
    >
      <Stack spacing={{ base: "4", md: "5" }}>
        <Stack justify="space-between" direction="row" align="center">
          {/* <Image maxHeight={10} src={Logo} /> */}
          <ButtonGroup variant="ghost">
            <IconButton
              as="a"
              href="https://github.com/sebasptsch"
              aria-label="GitHub"
              icon={<FaGithub fontSize="1.25rem" />}
            />
            <IconButton
              as="a"
              href="https://twitter.com/sebasptsch"
              aria-label="Twitter"
              icon={<FaTwitter fontSize="1.25rem" />}
            />
          </ButtonGroup>
        </Stack>
        <Text fontSize="sm" color="subtle">
          &copy; {new Date().getFullYear()} Sebastian Pietschner. All rights
          reserved.
        </Text>
      </Stack>
    </Container>
  );
};
export default Footer;
