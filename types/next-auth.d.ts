import NextAuth, { DefaultSession } from "next-auth"
import { DefaultJWT } from "@auth/core/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }
  interface JWT {
    id: string & DefaultJWT
  }
}