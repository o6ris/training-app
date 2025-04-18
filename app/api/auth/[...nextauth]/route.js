import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import User from "@modules/server/models/user";
import connectDb from "lib/mongodb";

export const authOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        await connectDb();
        try {
          const user = await User.findOne({ email: credentials.email });
          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (isPasswordCorrect) {
              return user;
            }
          } else {
            throw { message: "User doesn't exist" };
          }
        } catch (err) {
          const { message, status } = err;
          throw new Error(message);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") {
        return true;
      }
      if (account?.provider === "google") {
        await connectDb();
        try {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            const newUser = new User({
              email: user.email,
            });
            await newUser.save();
            return true;
          }
          return true;
        } catch (err) {
          console.error("Sign-in error:", err);
          return false;
        }
      }
    },
    async jwt({ token }) {
      await connectDb();
      try{
        const user =  await User.findOne({ email: token.email })
        if (user) {
          token.first_connexion = user.first_connexion;
          token.policy = user.policy;
        }
        return token;
      } catch(error) {
        console.error("error", error)
      }
    },
    async session({ session, token }) {
      session.user.first_connexion = token.first_connexion;
      session.user.policy = token.policy;
      return session;
    },
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
