import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuProps,
} from "@chakra-ui/react";
import { DraftStatus } from "@prisma/client";
import { Form, Link } from "@remix-run/react";

interface PostMenuProps {
  post: {
    id: number;
    status: DraftStatus;
    slug: string;
  };
}

export const PostMenu: React.FC<
  PostMenuProps & Omit<MenuProps, "children">
> = ({ post, ...rest }) => {
  return (
    <Menu {...rest}>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        Actions
      </MenuButton>
      <MenuList as={Form} reloadDocument method="post">
        <input type="hidden" name="id" value={post.id.toString()} />
        <MenuItem name="action" type="submit" value="status">
          {post.status === "PUBLISHED" ? "Draft" : "Publish"}
        </MenuItem>
        <MenuItem type="submit" name="action" value="delete">
          Delete
        </MenuItem>
        <MenuItem as={Link} to={`/posts/${post.slug}/edit`}>
          Edit
        </MenuItem>
        {/* <MenuItem>Delete</MenuItem>
        <MenuItem>Attend a Workshop</MenuItem> */}
      </MenuList>
    </Menu>
  );
};
export default PostMenu;
