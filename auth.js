import { jwtDecode } from "jwt-decode";
import NextAuth from "next-auth"
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
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(credentials),
            }
          );

          const data = await res.json();
          const decodedToken = jwtDecode(data.token);
          console.log("decodedToken", decodedToken);
          const user = {
            token: data.token,
            role: decodedToken.role,
            name: decodedToken.name,
            email: decodedToken.email,
            userType: decodedToken.userType,
          }
          console.log("user", user);
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
      }
      return token;
    },
    async session({ session, token }) {
      const decodedToken = jwtDecode(token.accessToken);
      session.user = {
        name: token.name,
        email: token.email,
        role: token.role,
        accessToken: token.accessToken,
        userType: decodedToken.userType || null,
      };

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
})