import GoogleProvider from "next-auth/providers/google";

import connectDB from "@/config/database";

import User from "@/models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
  //TODO Add more providers later!
  callbacks: {
    async signIn({ profile }) {
      await connectDB();

      const userExists = await User.findOne({
        email: profile.email,
      });

      if (!userExists) {
        const username = profile.name.slice(0, 20);

        await User.create({
          email: profile.email,
          username,
          image: profile.picture,
        });
      }
      return true;
    },
  },
  //Session Callback that modifies the session object
  async session({ session }) {
    //* Get user from database
    const user = await User.findOne({
      email: session.user.email,
    });

    //* Assign the user id from the database to the session object
    session.user.id = user._id.toString();

    //* Return the modified session object
    return session;
  },
};
