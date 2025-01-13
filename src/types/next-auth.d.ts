import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
    createdAt: Date
    updatedAt: Date
  }

  interface Session {
    user: User & {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
      createdAt: Date
      updatedAt: Date
    }
  }
} 