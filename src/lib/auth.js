import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const email = credentials?.email?.trim();
        const password = credentials?.password;

        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        console.log("=== NextAuth authorize() ===");
        console.log("Credentials received:", { email, password: "***" });

        try {
          const loginPayloads = [
            { email, password },
            { identifier: email, password },
          ];

          let response;
          let data;

          for (const payload of loginPayloads) {
            console.log("Sending payload to API:", JSON.stringify(payload, null, 2));
            response = await fetch(`${apiUrl}/api/v1/auths/login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });

            data = await response.json();

            if (response.ok) {
              break;
            }

            console.warn("Login attempt failed for payload:", payload, data);
          }

          console.log("API response status:", response.status);
          console.log("API response body:", JSON.stringify(data, null, 2));

          if (!response.ok) {
            console.error("Login API error response:", data);
            const fieldError =
              data?.errors && typeof data.errors === "object"
                ? Object.values(data.errors)[0]
                : null;
            const errorMsg =
              fieldError || data.detail || data.message || "Invalid credentials";
            throw new Error(errorMsg);
          }

          const token = data.payload?.token || data.data?.token || data.token;
          if (!token) {
            console.error("No token in response:", data);
            throw new Error("No token received from server");
          }

          let decoded = {};
          try {
            decoded = jwtDecode(token);
            console.log("Token decoded successfully:", { id: decoded.id, email: decoded.email });
          } catch (decodeError) {
            console.error("JWT decode error:", decodeError);
            decoded = {
              id: email,
              email,
              name: "User",
            };
          }

          const user = {
            id:
              decoded.id ||
              decoded.userId ||
              data.payload?.id ||
              data.data?.id ||
              email,
            email:
              decoded.email ||
              data.payload?.email ||
              data.data?.email ||
              email,
            name:
              decoded.name ||
              data.payload?.name ||
              data.data?.name ||
              "User",
            accessToken: token,
          };
          
          console.log("User authenticated successfully:", { id: user.id, email: user.email });
          return user;
        } catch (error) {
          console.error("Authorization error:", error.message);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.accessToken = user.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.accessToken = token.accessToken;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },

  secret: process.env.NEXTAUTH_SECRET,
};

