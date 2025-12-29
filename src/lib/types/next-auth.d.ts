import { RoleName } from "@prisma/client";

declare module "next-auth" {
  interface User {
    id: string;
    role: RoleName;
    email: string;
    name?: string | null;
    profileImage?:string | null
  }

  interface Session {
    accessToken: string;
    user: {
      id: string;
      email: string;
      role: RoleName;
      name?: string | null;
      profileImage?:string | null
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: RoleName;
    email: string;
    accessToken: string;
  }
}
