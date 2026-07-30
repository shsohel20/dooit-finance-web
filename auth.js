import { jwtDecode } from "jwt-decode";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";

class InvalidCredentialsError extends CredentialsSignin {
  constructor(message) {
    super();
    this.code = message;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.

      credentials: {
        email: {},
        password: {},
        // userType: {},
      },
      authorize: async (credentials) => {
        try {
          const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}auth/login`;
          console.log("log1 login url", url);
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });
          console.log("log1 login res", res);

          const data = await res.json();

          // console.log("user", user);
          if (data.success) {
            const decodedToken = jwtDecode(data?.token);
            const user = {
              ...decodedToken,
              token: data.token,
              role: decodedToken.role,
              name: decodedToken.name,
              email: decodedToken.email,
              userType: decodedToken.userType,
              id: decodedToken.id,
            };
            return user;
          } else {
            throw new InvalidCredentialsError(data.error);
          }
        } catch (error) {
          throw new InvalidCredentialsError(error.code);
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
