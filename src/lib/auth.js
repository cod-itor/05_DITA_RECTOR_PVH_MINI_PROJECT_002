import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

async function loginWithPayload(payload) {
  const response = await fetch(`${apiUrl}/api/v1/auths/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  return { response, data };
}

function getTokenFromResponse(data) {
  return data?.payload?.token || data?.data?.token || data?.token || null;
}

function getErrorMessage(data) {
  const fieldError =
    data?.errors && typeof data.errors === "object"
      ? Object.values(data.errors)[0]
      : null;
  const message =
    fieldError || data?.detail || data?.message || "Invalid credentials";

  if (
    typeof message === "string" &&
    (message.toLowerCase().includes("must not be blank") ||
      message.toLowerCase().includes("must not be null"))
  ) {
    return "Invalid email or password";
  }

  return message;
}

function buildUser({ decoded, data, email, token }) {
  return {
    id: decoded?.id || decoded?.userId || data?.payload?.id || data?.data?.id || email,
    email:
      decoded?.email || data?.payload?.email || data?.data?.email || email,
    name: decoded?.name || data?.payload?.name || data?.data?.name || "User",
    accessToken: token,
  };
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim();
        const password = credentials?.password;

        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        const { response: finalResponse, data: finalData } =
          await loginWithPayload({ email, password });

        if (!finalResponse?.ok) {
          throw new Error(getErrorMessage(finalData));
        }

        const token = getTokenFromResponse(finalData);
        if (!token) throw new Error("No token received from server");

        let decoded = null;
        try {
          decoded = jwtDecode(token);
        } catch {
          decoded = { id: email, email, name: "User" };
        }

        return buildUser({ decoded, data: finalData, email, token });
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

