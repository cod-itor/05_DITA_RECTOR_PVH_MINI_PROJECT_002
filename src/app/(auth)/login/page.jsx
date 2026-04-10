import Link from "next/link";
import { use } from "react";
import LoginFormComponent from "../_components/LoginFormComponent";

export const metadata = {
  title: "Log in | PurelyStore",
  description: "Sign in to your account.",
};

export default function LoginPage({ searchParams }) {
  const params = use(searchParams);
  const registered = params?.registered === "true";

  return (
    <div className="w-full rounded-2xl border border-gray-100 bg-white p-8 shadow-lg shadow-gray-200/60 sm:p-10">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
        Log in
      </h1>

      {registered && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          ✓ Registration successful! Please log in with your credentials.
        </div>
      )}

      <LoginFormComponent />

      <p className="mt-8 text-center text-sm text-gray-600">
        No account yet?{" "}
        <Link
          href="/register"
          className="font-semibold text-lime-700 hover:text-lime-800"
        >
          Register
        </Link>
      </p>

      <p className="mt-6 text-center">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
