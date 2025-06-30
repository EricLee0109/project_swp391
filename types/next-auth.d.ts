import { Role } from "@/types/user/User";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      email: string;
      name: string;
    };
    accessToken?: string;
    refreshToken?: string;
  }

  interface User {
    id: string;
    role: Role;
    email: string;
    name: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    accessToken?: string;
    refreshToken?: string;
  }
}
