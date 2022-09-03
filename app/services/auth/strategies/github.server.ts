import { AccountType } from "@prisma/client";
import { DiscordStrategy, GitHubStrategy } from "remix-auth-socials";
import { authenticator } from "~/services/auth.server";
import { db } from "~/utils/db.server";

export const githubStrategy = new GitHubStrategy(
  {
    clientID: "",
    clientSecret: "",
    callbackURL: "",
  },
  async ({ profile }) => {
    const { user } = await db.provider.upsert({
      where: {
        uid_provider: {
          uid: profile.id,
          provider: AccountType.GITHUB,
        },
      },
      update: {},
      create: {
        uid: profile.id,
        provider: AccountType.GITHUB,
        user: {
          create: {
            name: profile.displayName,
          },
        },
      },
      include: { user: true },
    });
    return user;
  }
);
