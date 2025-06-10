import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_WEBAPP_GITHUB_CLIENT_ID,
      clientSecret: process.env.AUTH_WEBAPP_GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_WEBAPP_GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_WEBAPP_GOOGLE_CLIENT_SECRET,
    }),
  ],
});
