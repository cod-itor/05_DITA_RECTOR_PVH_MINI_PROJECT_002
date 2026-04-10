"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { registerUserAction } from "../../../app/action/auth.action";

export default function RegisterFormComponent() {
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      birthDate: "",
    },
  });

  const onSubmit = async (data) => {
    setSubmitError("");
    setIsLoading(true);

    try {
      const result = await registerUserAction({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        birthDate: data.birthDate,
      });

      if (result.success) {
        router.push("/login?registered=true");
      } else {
        setSubmitError(
          result.message || "Registration failed. Please try again.",
        );
      }
    } catch (error) {
      setSubmitError(error.message || "An unexpected error occurred");
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
        <label className="block text-sm font-medium text-gray-700">
          First name
        </label>
        <input
          type="text"
          disabled={isLoading}
          {...register("firstName", {
            required: "First name is required",
            minLength: {
              value: 2,
              message: "First name must be at least 2 characters",
            },
          })}
          placeholder="Jane"
          className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2 disabled:opacity-50"
        />
        {errors.firstName && (
          <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Last name
        </label>
        <input
          type="text"
          disabled={isLoading}
          {...register("lastName", {
            required: "Last name is required",
            minLength: {
              value: 2,
              message: "Last name must be at least 2 characters",
            },
          })}
          placeholder="Doe"
          className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2 disabled:opacity-50"
        />
        {errors.lastName && (
          <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          disabled={isLoading}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          placeholder="you@example.com"
          className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2 disabled:opacity-50"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          disabled={isLoading}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          placeholder="••••••••"
          className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2 disabled:opacity-50"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Birth date
        </label>
        <input
          type="date"
          disabled={isLoading}
          {...register("birthDate", {
            required: "Birth date is required",
          })}
          className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none ring-lime-400/20 focus:border-lime-400 focus:ring-2 disabled:opacity-50"
        />
        {errors.birthDate && (
          <p className="mt-1 text-xs text-red-600">{errors.birthDate.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-full bg-lime-400 py-3.5 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-lime-300 disabled:opacity-50"
      >
        {isLoading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
