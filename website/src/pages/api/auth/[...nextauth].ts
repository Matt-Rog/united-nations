import { base_url, web_url } from "@/utils/api";
import NextAuth, { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

const scopes = ["identify", "email", "guilds"].join(" ");

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "1",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "1",
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

  callbacks: {
    async session({ session }: any) {
      // Update the user object in the session with un api data
      if (session.user?.email && session.user.createdAt === undefined) {
        console.log("SESSION");
        console.log(session.user);
        var res = await fetch(`${web_url}/api/un`, {
          method: "POST",
          body: JSON.stringify({
            method: "GET",
            endpoint: `/users/${session.user.email}`,
          }),
        });
        const user = await res.json();
        console.log("NEW SESSION USER");
        console.log(user);
        session.user = user;
      }
      // Return the updated session object
      return session;
    },
    async signIn({ user, account, profile, email }) {
      if (account) {
        const { access_token } = account;
        var res = await fetch(`${web_url}/api/un`, {
          method: "POST",
          body: JSON.stringify({
            method: "POST",
            endpoint: "/auth",
            params: [{ accessToken: access_token }],
            payload: profile,
          }),
        });

        if (res.status === 200) {
          return Promise.resolve(true);
        }
      }
      return Promise.resolve(false);
    },
  },
};

export default NextAuth(authOptions);
