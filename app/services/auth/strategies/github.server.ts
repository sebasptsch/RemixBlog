import { AccountType } from "@prisma/client";
import { DiscordStrategy, GitHubStrategy } from "remix-auth-socials";
import { authenticator } from "~/services/auth.server";
import { config } from "~/services/config.server";
import { db } from "~/utils/db.server";

export const githubStrategy = new GitHubStrategy(
  {
    clientID: config.getOrThrow("GITHUB_CLIENT_ID"),
    clientSecret: config.getOrThrow("GITHUB_CLIENT_SECRET"),
    callbackURL: config.getOrThrow("GITHUB_CALLBACK"),
  },
  async ({ profile }) => {
    const { user } = await db.provider.upsert({
      where: {
        uid_provider: {
          uid: profile.id,
          provider: AccountType.GITHUB,
        },
      },
      update: {
        user: {
          update: {
            name: profile.displayName,
          },
        },
      },
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
