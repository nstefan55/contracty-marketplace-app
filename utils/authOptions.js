import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";

import connectDB from "@/config/database";

import User from "@/models/User";

const DEFAULT_PROFILE_IMAGE_URL =
  "https://res.cloudinary.com/devslulj5/image/upload/v1777836733/default-image_yywmnk.png";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcryptjs.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.profileImage || user.image || DEFAULT_PROFILE_IMAGE_URL,
        };
      },
    }),
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
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "google") {
        return true;
      }

      await connectDB();

      const userExists = await User.findOne({
        email: profile?.email,
      });

      if (!userExists) {
        const name =
          profile?.name?.slice(0, 20) ||
          profile?.email?.split("@")[0] ||
          "User";
        const profileImage = profile?.picture || DEFAULT_PROFILE_IMAGE_URL;

        await User.create({
          name,
          email: profile.email,
          image: profileImage,
          profileImage,
        });
      }
      return true;
    },
  },
  //Session Callback that modifies the session object
  async session({ session }) {
    await connectDB();

    //* Get user from database
    const user = await User.findOne({
      email: session.user.email,
    });

    if (!user) {
      session.user.id = "";
      session.user.image = DEFAULT_PROFILE_IMAGE_URL;
      session.user.profileImage = DEFAULT_PROFILE_IMAGE_URL;
      return session;
    }

    //* Assign the user id from the database to the session object
    session.user.id = user._id.toString();
    session.user.profileImage =
      user.profileImage || user.image || DEFAULT_PROFILE_IMAGE_URL;
    session.user.image = session.user.profileImage;

    //* Return the modified session object
    return session;
  },
};
