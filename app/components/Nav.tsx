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
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  Profile
                </MenuButton>
                <MenuList>
                  <MenuItem as={Link} to="/profile">
                    My Account
                  </MenuItem>
                  {user.role === Role.ADMIN ? (
                    <MenuItem as={Link} to="/admin/posts">
                      Posts
                    </MenuItem>
                  ) : null}
                  {user.role === Role.ADMIN ? (
                    <MenuItem as={Link} to="/admin/users">
                      Users
                    </MenuItem>
                  ) : null}
                  <MenuItem as={Link} to="/auth/logout">
                    Logout
                  </MenuItem>
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
