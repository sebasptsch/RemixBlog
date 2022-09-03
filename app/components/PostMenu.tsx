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
import { Link } from "@remix-run/react";

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
      <MenuList>
        <MenuItem
          onClick={() => {
            if (post.status === "PUBLISHED") {
              // Make Draft
              //   api.posts
              //     .editPostById(post.id, {
              //       status: EditPostDto.status.DRAFT,
              //     })
              //     .then(() => {
              //       mutate("/posts/me");
              //     });
            } else if (post.status === "DRAFT") {
              // Publish
              //   api.posts
              //     .editPostById(post.id, {
              //       status: EditPostDto.status.PUBLISHED,
              //     })
              //     .then(() => {
              //       mutate("/posts/me");
              //     });
            }
          }}
        >
          {post.status === "PUBLISHED" ? "Draft" : "Publish"}
        </MenuItem>
        <MenuItem
          onClick={() => {
            // api.posts.deletePostById(post.id).then(() => {
            //   mutate("/posts/me");
            // });
          }}
        >
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
