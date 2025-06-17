import NextAuth, { DefaultSession, DefaultUser, DefaultJWT } from "next-auth";

// Extend Session type
declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken: string;
    user: {
      user_id: string;
      email: string;
      password_hash: string;
      role: string;
      full_name: string;
      phone_number: string | null;
      address: string | null;
      is_verified: boolean;
      is_active: boolean;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
    };
  }

  interface User {
    accessToken: string;
    refreshToken: string;
    user: {
      user_id: string;
      email: string;
      password_hash: string;
      role: string;
      full_name: string;
      phone_number: string | null;
      address: string | null;
      is_verified: boolean;
      is_active: boolean;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
    };
  }
}

// Extend JWT type
declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    user: {
      user_id: string;
      email: string;
      password_hash: string;
      role: string;
      full_name: string;
      phone_number: string | null;
      address: string | null;
      is_verified: boolean;
      is_active: boolean;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
    };
  }
}
