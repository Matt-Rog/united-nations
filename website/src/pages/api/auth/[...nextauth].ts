import { User } from "@/models/users";
import { base_url, web_url } from "@/utils/api";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const { email, password } = credentials as any;
        const res = await fetch(`${web_url}/api/un`, {
          method: "POST",
          body: JSON.stringify({
            method: "POST",
            endpoint: "/auth/login",
            payload: { email: email, password: password },
          }),
        });
        const user: User = await res.json();
        if (res.ok && user) {
          return user;
        } else return null;
      },
    }),
  ],

  callbacks: {
    async session({ session, token, user }) {
      session.user = token;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.data = user;
      }
      return token;
    },
  },

  session: {
    strategy: "jwt",
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 15 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
  },
};

export default NextAuth(authOptions);
