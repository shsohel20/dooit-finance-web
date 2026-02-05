import { jwtDecode } from "jwt-decode";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.

      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/login`;
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });

          const data = await res.json();
          const decodedToken = jwtDecode(data.token);
          const user = {
            ...decodedToken,
            token: data.token,
            role: decodedToken.role,
            name: decodedToken.name,
            email: decodedToken.email,
            userType: decodedToken.userType,
            id: decodedToken.id,
          };
          if (data.success) {
            return user;
          } else {
            return null;
          }
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      const decodedToken = jwtDecode(token.accessToken);
      session.user = {
        ...decodedToken,
        name: token.name,
        email: token.email,
        role: token.role,
        accessToken: token.accessToken,
        userType: decodedToken.userType || null,
        id: token.id,
      };

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
