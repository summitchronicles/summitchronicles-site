import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "admin-credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@summitchronicles.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Admin credential check
        if (
          credentials?.email === process.env.ADMIN_EMAIL &&
          credentials?.password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: "admin",
            email: process.env.ADMIN_EMAIL,
            name: "Summit Chronicles Admin",
            role: "admin"
          }
        }
        
        // Check for Sunith's Google account specifically
        if (credentials?.email === "sunith@summitchronicles.com") {
          // This would normally validate against a database
          // For now, allow specific admin email with password
          if (credentials?.password === process.env.SUNITH_PASSWORD) {
            return {
              id: "sunith",
              email: "sunith@summitchronicles.com", 
              name: "Sunith Kumar",
              role: "owner"
            }
          }
        }
        
        return null
      }
    })
  ],
  pages: {
    signIn: '/admin/auth/signin',
    error: '/admin/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || 'user'
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.sub
        ;(session.user as any).role = token.role
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Allow admin credentials always
      if (account?.provider === "credentials") {
        return true
      }
      
      // For Google OAuth, only allow specific emails
      const allowedEmails = [
        process.env.ADMIN_EMAIL,
        "sunith@summitchronicles.com",
        // Add other authorized emails here
      ].filter(Boolean)
      
      if (account?.provider === "google") {
        return allowedEmails.includes(user.email || "")
      }
      
      return false
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}