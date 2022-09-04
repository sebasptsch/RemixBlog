import {
  Button,
  Code,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useTransition } from "@remix-run/react";
import { mixed, object, string, ValidationError } from "yup";
import RichTextBlock from "~/components/Editor/richTextEditor";
import { authenticator } from "~/services/auth.server";
import { db } from "~/utils/db.server";

type LoaderData = User;

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/auth/login",
  });
  if (user.role !== "ADMIN") return redirect("/auth/login");
};

export const meta: MetaFunction = ({ data }: { data: LoaderData }) => ({
  title: `New Post`,
  description: "The post creation screen.",
});

export const action: ActionFunction = async ({ request }) => {
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
      content: mixed<string>()
        .transform((v) => JSON.parse(v))
        .required(),
    });

    // covert formData to object
    const data = Object.fromEntries(formData.entries());
    console.log({ data });
    const { title, slug, content, summary } = await createPostSchema.validate(
      data
    );

    try {
      const post = await db.post.create({
        data: {
          title,
          slug,
          content,
          summary,
          user: {
            connect: { id: user.id },
          },
        },
      });

      return redirect(`/posts/${post.slug}/edit`);
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
};

const CreatePost = () => {
  const error = useActionData<ValidationError>();
  const transitionData = useTransition();

  return (
    <Form method="post">
      <Code>
        <pre>{JSON.stringify(error, undefined, 4)}</pre>
      </Code>
      <FormControl isRequired isInvalid={error?.path === "title"}>
        <FormLabel htmlFor="title">Title</FormLabel>
        <Input
          id="title"
          type="text"
          name="title"
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
          required
          // {...register("summary", { required: true })}
        />
        <FormHelperText>Enter a quick summary of the post here</FormHelperText>
        <FormErrorMessage>{error?.message}</FormErrorMessage>
      </FormControl>
      <RichTextBlock name="content" />
      <Button type="submit" isLoading={transitionData.state === "submitting"}>
        Submit
      </Button>
    </Form>
  );
};
export default CreatePost;
