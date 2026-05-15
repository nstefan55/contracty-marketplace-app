import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import connectDB from "@/config/database";
import User from "@/models/User";
import { authConfig } from "@/auth.config";

import { ZodError } from "zod";
import { signInSchema } from "@/lib/zod";

import { verifyPassword } from "@/lib/password";

import { MongoDBAdapter } from "@auth/mongodb-adapter";

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/devslulj5/image/upload/v1777836733/default-image_yywmnk.png";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapters: MongoDBAdapter(connectDB),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        signInToken: { label: "Sign-in token", type: "text" },
      },
      authorize: async (credentials) => {
        await connectDB();

        // Post-OTP sign-in via one-time token
        if (credentials.signInToken) {
          const user = await User.findOneAndUpdate(
            {
              email: credentials.email,
              signInToken: credentials.signInToken,
              signInTokenExpiry: { $gt: new Date() },
            },
            { $unset: { signInToken: "", signInTokenExpiry: "" } },
            { new: true },
          );

          if (!user) throw new Error("Invalid or expired sign-in token");

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image || DEFAULT_IMAGE,
            role: user.role,
            needsOnboarding: user.needsOnboarding,
          };
        }

        // Validate shape before hitting the DB
        let email, password;
        try {
          ({ email, password } = await signInSchema.parseAsync(credentials));
        } catch (error) {
          if (error instanceof ZodError) {
            throw new Error(error.errors.map((e) => e.message).join(", "));
          }
          throw error;
        }

        // Normal password sign-in
        const user = await User.findOne({ email });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        if (!user.emailVerified) {
          throw new Error(
            "Please verify your email before signing in. Check your inbox for a verification code.",
          );
        }

        const isValid = await verifyPassword(password, user.password);

        if (!isValid) throw new Error("Invalid email or password");

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image || DEFAULT_IMAGE,
          role: user.role,
          needsOnboarding: user.needsOnboarding,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();
        const exists = await User.findOne({ email: user.email });
        if (!exists) {
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image || DEFAULT_IMAGE,
            needsOnboarding: true,
          });
        }
      }
      return true;
    },

    async jwt({ token, user, account, trigger }) {
      // Google sign-in: read DB directly — mutations to `user` in signIn
      // are not reliably forwarded in Auth.js v5, so we query here instead.
      if (account?.provider === "google") {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email }).lean();
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role ?? null;
          token.needsOnboarding = dbUser.needsOnboarding ?? false;
        }
      }

      // Credentials sign-in: authorize() already returned the full user object.
      if (user && account?.provider === "credentials") {
        token.id = user.id;
        token.role = user.role ?? null;
        token.needsOnboarding = user.needsOnboarding ?? false;
      }

      // Refresh after session.update() is called client-side (e.g. welcome page).
      if (trigger === "update" && token.id) {
        await connectDB();
        const dbUser = await User.findById(token.id).lean();
        if (dbUser) {
          token.role = dbUser.role ?? null;
          token.needsOnboarding = dbUser.needsOnboarding ?? false;
        }
      }

      // Self-heal stale JWT while onboarding is pending: update() in auth.js v5
      // beta doesn't reliably rewrite the cookie, so re-read from DB until the
      // token reflects the completed onboarding state.
      if (token.id && token.needsOnboarding) {
        await connectDB();
        const dbUser = await User.findById(token.id).lean();
        if (dbUser) {
          token.role = dbUser.role ?? null;
          token.needsOnboarding = dbUser.needsOnboarding ?? false;
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.needsOnboarding = token.needsOnboarding;
      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },
});
