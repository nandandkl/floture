import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "google") {
        token.name = profile?.name;
        token.email = profile?.email;
        token.picture = profile?.picture;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.image = token.picture;
      return session;
    },

    async redirect({ baseUrl }) {
      return `${baseUrl}/app/detect`;
    }
  }
});

export { handler as GET, handler as POST };
