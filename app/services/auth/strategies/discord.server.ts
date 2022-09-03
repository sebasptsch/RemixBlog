import { AccountType } from "@prisma/client";
import { DiscordStrategy } from "remix-auth-socials";
import { authenticator } from "~/services/auth.server";
import { db } from "~/utils/db.server";

export const discordStrategy = new DiscordStrategy(
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
          provider: AccountType.DISCORD,
        },
      },
      update: {},
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
