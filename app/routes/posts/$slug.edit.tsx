import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Post, Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { Descendant } from "slate";
import { object, string, ValidationError } from "yup";
import RichTextBlock from "~/components/Editor/richTextEditor";
import { authenticator } from "~/services/auth.server";
import { db } from "~/utils/db.server";

interface LoaderData {
  post: Post;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const post = await db.post.findUniqueOrThrow({
    where: { slug: params.slug! },
  });
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: `/posts/${post.slug}`,
  });
  if (post.userId === user.id) return { post };
};

export const action: ActionFunction = async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/login",
  });

  try {
    const formData = await request.formData();
    const createPostSchema = object({
      title: string().required(),
      slug: string()
        .matches(/^[a-z0-9]+(?:[-/][a-z0-9]+)*$/)
        .required(),
      summary: string().required(),
      content: string().required(),
    });

    // covert formData to object
    const data = Object.fromEntries(formData.entries());

    const { title, slug, content, summary } = await createPostSchema.validate(
      data
    );

    try {
      const post = await db.post.update({
        where: { id: parseInt(params.id!) },
        data: {
          title,
          slug,
          content: JSON.parse(content),
          summary,
          user: {
            connect: { id: user.id },
          },
        },
      });

      return null;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ValidationError(
            "slug must be unique",
            data,
            "slug",
            "unique"
          );
        }
      }
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      return error;
    }
  }
  return null;
};

const EditPost = () => {
  const error = useActionData<ValidationError>();
  const { post } = useLoaderData<LoaderData>();
  const transitionStatus = useTransition();

  return (
    <Form method="post">
      <FormControl isRequired isInvalid={error?.path === "title"}>
        <FormLabel htmlFor="title">Title</FormLabel>
        <Input
          id="title"
          type="text"
          name="title"
          defaultValue={post.title}
          required
          // {...register("title", { required: true })}
        />
        <FormHelperText>Enter a title here</FormHelperText>
        <FormErrorMessage>{error?.message}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={error?.path === "slug"}>
        <FormLabel htmlFor="slug">Slug</FormLabel>
        <Input
          id="slug"
          //   pattern={/^[a-z0-9]+(?:[-/][a-z0-9]+)*$/}
          type="text"
          name="slug"
          defaultValue={post.slug}
          required
        />
        <FormHelperText>Enter a slug here</FormHelperText>
        <FormErrorMessage>{error?.message}</FormErrorMessage>
      </FormControl>
      <FormControl
        isRequired
        //   isInvalid={errors.summary && touchedFields.summary}
        isInvalid={error?.path === "summary"}
      >
        <FormLabel htmlFor="summary">Summary</FormLabel>
        <Input
          id="summary"
          name="summary"
          type="text"
          defaultValue={post.summary}
          required
          // {...register("summary", { required: true })}
        />
        <FormHelperText>Enter a quick summary of the post here</FormHelperText>
        <FormErrorMessage>{error?.message}</FormErrorMessage>
      </FormControl>
      <RichTextBlock
        name="content"
        defaultValue={post.content as Prisma.JsonArray as Descendant[]}
      />
      <Button type="submit" isLoading={transitionStatus.state === "submitting"}>
        Submit
      </Button>
    </Form>
  );
};
export default EditPost;
