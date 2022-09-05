import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export let action: ActionFunction = ({ request }) =>
  authenticator.logout(request, { redirectTo: "/auth/login" });

export let loader: LoaderFunction = ({ request }) =>
  authenticator.logout(request, { redirectTo: "/auth/login" });
