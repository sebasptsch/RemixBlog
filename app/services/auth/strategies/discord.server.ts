import { AccountType } from "@prisma/client";
import { DiscordStrategy } from "remix-auth-socials";
import { authenticator } from "~/services/auth.server";
import { config } from "~/services/config.server";
import { db } from "~/utils/db.server";

export const discordStrategy = new DiscordStrategy(
  {
    clientID: config.getOrThrow("DISCORD_CLIENT_ID"),
    clientSecret: config.getOrThrow("DISCORD_CLIENT_SECRET"),
    callbackURL: config.getOrThrow("DISCORD_CALLBACK"),
  },
  async ({ profile }) => {
    const { user } = await db.provider.upsert({
      where: {
        uid_provider: {
          uid: profile.id,
          provider: AccountType.DISCORD,
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
        provider: AccountType.DISCORD,
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
