import { UserRole } from "@prisma/client"
import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    firstName?: string | null
    lastName?: string | null
    role?: UserRole
    bio?: string | null
  }
  
  interface Session {
    user: User & {
      id: string
      firstName?: string | null
      lastName?: string | null
      role?: UserRole
      bio?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    firstName?: string | null
    lastName?: string | null
    role?: UserRole
    bio?: string | null
  }
} 