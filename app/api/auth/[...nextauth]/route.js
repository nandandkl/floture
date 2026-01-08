import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@/lib/mongodb";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const client = await clientPromise;
          const db = client.db("flotureDB");
          const usersCollection = db.collection("users");

          const existingUser = await usersCollection.findOne({ email: user.email });

          // If user exists and has a password, they should use email/password login
          if (existingUser && existingUser.password) {
            // Throwing or returning false will redirect to the error page
            // We can return a redirect URL instead
            return `/auth/login?error=emailPasswordAccount`;
          }

          await usersCollection.updateOne(
            { email: user.email },
            {
              $set: {
                name: user.name,
                email: user.email,
                image: user.image,
                verified: true,
                updatedAt: new Date(),
              },
              $setOnInsert: {
                createdAt: new Date(),
              }
            },
            { upsert: true }
          );
          return true;
        } catch (error) {
          console.error("Error saving Google user to MongoDB:", error);
          return true; // Still allow sign in even if DB update fails, or return false to block
        }
      }
      return true;
    },

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
