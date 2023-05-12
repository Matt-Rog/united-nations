import { User } from "@/models/users";
import { base_url, web_url } from "@/utils/api";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";

const scopes = ["identify", "email", "guilds"].join(" ");

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "1",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "1",
      // scope: "identify email guilds",
      authorization: { params: { scope: scopes } },
    }),
  ],

  session: {
    strategy: "jwt",
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 15 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/auth",
    signOut: "/auth",
  },
};

export default NextAuth(authOptions);
