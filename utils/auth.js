import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";

import connectDB from "@/config/database";

import User from "@/models/User";

const DEFAULT_PROFILE_IMAGE_URL =
  "https://res.cloudinary.com/devslulj5/image/upload/v1777836733/default-image_yywmnk.png";

export const authOptions = {
  providers: [
    GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          profile(googleUser) {
            return {
              id: googleUser.sub,
              name: googleUser.name,
              email: googleUser.email,
              image: googleUser.picture || DEFAULT_PROFILE_IMAGE_URL,
            };
          },
          //! Prevent last authorized account to be automatically signed in
          authorization: {
            params: {
              prompt: "consent",
              access_type: "offline",
              response_type: "code",
            },
          },
        }),

    CredentialsProvider ({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      authorize: async (credentials) => {
        await connectDB();

        let user = null;

        user = await User.findOne({
          email: credentials.email,
        });

        // No user found, so this is their first attempt to login
        if (!user) {
          throw new Error("Invalid email or password");
        }

        // Compare password with hash
        const isPasswordValid = await bcryptjs.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image || DEFAULT_PROFILE_IMAGE_URL,
        };
      }
    }),
  ],
};

export const handlers = NextAuth(authOptions);
export const { signIn, signOut } = handlers;