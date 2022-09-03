// app/services/auth.server.ts
import { AccountType, User } from "@prisma/client";
import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import { discordStrategy } from "./auth/strategies/discord.server";
import { localStrategy } from "./auth/strategies/form.server";
import { githubStrategy } from "./auth/strategies/github.server";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<User>(sessionStorage);

authenticator
  .use(discordStrategy, AccountType.DISCORD.toLowerCase())
  .use(localStrategy, AccountType.LOCAL.toLowerCase())
  .use(githubStrategy, AccountType.GITHUB.toLowerCase());
