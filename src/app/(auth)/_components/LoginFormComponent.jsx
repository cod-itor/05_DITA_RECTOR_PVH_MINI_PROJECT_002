"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { useForm } from "react-hook-form";

export default function LoginFormComponent() {
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setSubmitError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      const rawError =
        typeof result?.error === "string" ? result.error.trim() : "";

      if (rawError && rawError !== "undefined") {
        let errorMessage = rawError;

        if (errorMessage.includes("Email and password are required")) {
          errorMessage = "Please enter both email and password";
        } else if (errorMessage.includes("Invalid email")) {
          errorMessage = "Invalid email format";
        } else if (errorMessage.includes("No token received")) {
          errorMessage =
            "Server error: No authentication token received. Please contact support.";
        } else if (errorMessage.includes("Authentication failed")) {
          errorMessage =
            "Authentication failed. Please check your credentials.";
        } else if (errorMessage.includes("Email and password are required")) {
          errorMessage = "Email and password are required";
        } else if (!errorMessage || errorMessage === "Error") {
          errorMessage = "Login failed. Please check your email and password.";
        }

        setSubmitError(errorMessage);
        console.error("Login error details:", rawError);
      } else if (result?.ok || !rawError) {
        router.replace("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Login exception:", error);
      setSubmitError(
        error.message || "An unexpected error occurred during login",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="mt-8 space-y-5"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {submitError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {submitError}
        </div>
      )}

      <div>
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          disabled={isLoading}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2 disabled:opacity-50"
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="login-password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          disabled={isLoading}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2 disabled:opacity-50"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-full bg-lime-400 py-3.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-lime-300 disabled:opacity-50"
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
