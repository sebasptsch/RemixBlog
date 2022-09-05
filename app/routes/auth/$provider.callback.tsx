// app/routes/auth/$provider.callback.tsx
import { LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";

export let loader: LoaderFunction = ({ request, params }) => {
  if (!params.provider) throw new Error("Not a valid provider");
  return authenticator.authenticate(params.provider, request, {
    successRedirect: "/profile",
    failureRedirect: "/auth/login",
  });
};
