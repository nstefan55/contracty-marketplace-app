export const authConfig = {
  trustHost: true,
  providers: [],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? null;
        token.needsOnboarding = user.needsOnboarding ?? false;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.needsOnboarding = token.needsOnboarding;
      session.user.contractorSlug = token.contractorSlug ?? null;
      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },
};
