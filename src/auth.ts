import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { isEmailVerificationConfigured } from "@/lib/email-verification";
import User from "@/models/User";

const hasGoogleCredentials =
  !!process.env.GOOGLE_CLIENT_ID &&
  !!process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CLIENT_ID !== "your_google_client_id";

const providers: Provider[] = [
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      try {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const normalizedEmail = String(credentials.email).trim().toLowerCase();
        const plainPassword = String(credentials.password);

        await connectDB();

        const user = await User.findOne({
          email: normalizedEmail,
        }).select("+password");

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(plainPassword, user.password);
        if (!isValid) {
          return null;
        }

        // Legacy users created before verification rollout are treated as verified.
        const isVerified =
          typeof user.isEmailVerified === "boolean" ? user.isEmailVerified : true;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          emailVerified: isVerified,
        };
      } catch (error) {
        console.error("Credentials authorize error:", error);
        return null;
      }
    },
  }),
];

if (hasGoogleCredentials) {
  providers.unshift(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        const verificationRequired = isEmailVerificationConfigured();
        const verified = Boolean((user as { emailVerified?: boolean }).emailVerified);
        if (verificationRequired && !verified) {
          const email = user.email ?? "";
          return `/auth/signin?error=EmailNotVerified&email=${encodeURIComponent(email)}`;
        }
      }

      if (account?.provider === "google") {
        if (!user.email) {
          console.error("Google user missing email");
          return "/auth/signin?error=AccessDenied";
        }

        try {
          await connectDB();
          const normalizedEmail = user.email.toLowerCase();
          const existingUser = await User.findOne({
            email: normalizedEmail,
          });

          if (!existingUser) {
            await User.create({
              name: user.name || "User",
              email: normalizedEmail,
              image: user.image ?? undefined,
              isEmailVerified: true,
              emailVerifiedAt: new Date(),
            });
          } else if (!existingUser.isEmailVerified) {
            existingUser.isEmailVerified = true;
            existingUser.emailVerifiedAt = new Date();
            existingUser.emailVerificationToken = undefined;
            existingUser.emailVerificationExpires = undefined;
            await existingUser.save();
          }

          return true;
        } catch (error) {
          // Do not block OAuth login when persistence fails (e.g., temporary DB outage).
          // User can still sign in and use guest-like experience until DB is reachable.
          console.error("Google sign-in persistence warning:", error);
          return true;
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
});
