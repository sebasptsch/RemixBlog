import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonGroup,
  Container,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  useColorMode,
} from "@chakra-ui/react";
import { Role } from "@prisma/client";
import { Link } from "@remix-run/react";
import { FaHome } from "react-icons/fa";
import { MdDarkMode, MdLightMode } from "react-icons/md";
// import Logo from "../logo.svg";

const Nav: React.FC<{
  user?: {
    role: Role;
  };
}> = ({ user }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Container maxW="container.lg">
      <Flex m={3}>
        <IconButton icon={<FaHome />} aria-label={"home"} as={Link} to="/" />

        <Spacer />
        <ButtonGroup spacing={6}>
          <IconButton
            aria-label="switch theme"
            onClick={toggleColorMode}
            icon={colorMode === "dark" ? <MdDarkMode /> : <MdLightMode />}
          />
          {user ? (
            <>
              <Button as={Link} to="/auth/logout">
                Logout
              </Button>
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  Profile
                </MenuButton>
                <MenuList>
                  <MenuItem as={Link} to="/profile">
                    My Account
                  </MenuItem>
                  {user.role === Role.ADMIN ? (
                    <MenuItem as={Link} to="/admin">
                      Posts
                    </MenuItem>
                  ) : null}
                </MenuList>
              </Menu>
            </>
          ) : (
            <>
              <Button as={Link} to="/auth/login">
                Sign In
              </Button>
              <Button as={Link} to="/auth/register">
                Sign Up
              </Button>
            </>
          )}
        </ButtonGroup>
      </Flex>
    </Container>
  );
};

export default Nav;
