// app/routes/auth/$provider.tsx
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export let loader: LoaderFunction = () => redirect("/auth/login");

export let action: ActionFunction = ({ request, params }) => {
  if (!params.provider) throw new Error("Not a valid provider");
  return authenticator.authenticate(params.provider, request);
};
