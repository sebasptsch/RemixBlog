import { AccountType } from "@prisma/client";
import { FormStrategy } from "remix-auth-form";
import { db } from "~/utils/db.server";
import * as argon from "argon2";
import { authenticator } from "~/services/auth.server";

// Tell the Authenticator to use the form strategy
export const localStrategy = new FormStrategy(async ({ form }) => {
  let username = form.get("username");
  if (!username) throw new Error("No username");
  let password = form.get("password");
  if (!password) throw new Error("No password");

  if (typeof password !== "string")
    throw new Error("Password must be a string");
  if (typeof username !== "string")
    throw new Error("Password must be a string");

  const localProvider = await db.provider.findUnique({
    where: {
      uid_provider: {
        uid: username,
        provider: AccountType.LOCAL,
      },
    },
    include: {
      user: true,
    },
  });

  if (!localProvider) throw new Error("No account");

  if (!localProvider.password) throw new Error("No password");

  const pwMatches = await argon.verify(localProvider.password, password);

  if (!pwMatches) throw new Error("Incorrect password");

  return localProvider.user;
});
