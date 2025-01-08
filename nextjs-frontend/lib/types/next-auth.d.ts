
// nextauth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

export enum Role {
  manager = "manager",
  instructor = "instructor",
  student = "student",
  admin = "admin",
}

interface IUser extends DefaultUser {
  /**
   * Role of user
   */
  role?: Role;
  workspace_id?: string;
  access_token?: string;
  refresh_token?: string;
  accessTokenExpiry?: date;
  /**
   * Field to check whether a user has a subscription
   */
  subscribed?: boolean;
}
declare module "next-auth" {
  interface User extends IUser {}
  interface Session {
    user?: User;
    error?: "RefreshAccessTokenError" | string
  }

}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpiry: number;
    error?: "RefreshAccessTokenError" | string
  }
}