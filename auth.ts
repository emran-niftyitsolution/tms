import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectToDatabase from "./lib/db";
import User from "./lib/models/user";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials");
            throw new Error("Missing email or password");
          }

          console.log("Connecting to DB...");
          await connectToDatabase();
          console.log("Connected to DB");

          console.log("Finding user:", credentials.email);
          const user = await User.findOne({ email: credentials.email }).select(
            "+password",
          );

          if (!user) {
            console.log("User not found");
            throw new Error("Invalid email or password");
          }

          console.log("Checking password...");
          const isMatch = await bcrypt.compare(
            credentials.password as string,
            user.password,
          );

          if (!isMatch) {
            console.log("Password mismatch");
            throw new Error("Invalid email or password");
          }

          console.log("Login successful:", user.name);
          return {
            name: user.name,
            email: user.email,
            id: user._id.toString(),
          };
        } catch (error) {
          console.error("Auth error:", error);
          // Return null to indicate auth failure instead of crashing
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
});
