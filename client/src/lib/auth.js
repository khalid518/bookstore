import { createAuthClient } from 'better-auth/react'

// Requests go to /api/auth on the same origin (Vite proxy in dev, Vercel rewrite in production).
export const authClient = createAuthClient({ baseURL: window.location.origin })

export const { useSession, signIn, signUp, signOut } = authClient
