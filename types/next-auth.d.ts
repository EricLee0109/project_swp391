import NextAuth, { DefaultSession, DefaultUser, DefaultJWT } from "next-auth";

// Extend Session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    accessToken: string;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    accessToken: string;
  }
}

// Extend JWT type
declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    accessToken: string;
  }
}
