"use server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function registerUserAction(formData) {
  try {
    const { firstName, lastName, email, password, birthDate } = formData;

    if (!firstName || !lastName || !email || !password || !birthDate) {
      return {
        success: false,
        message:
          "First name, last name, email, password, and birth date are required",
      };
    }

    const body = {
      firstName,
      lastName,
      email,
      password,
      birthDate,
    };

    console.log("=== REGISTRATION ===");
    console.log("User Input:", {
      firstName,
      lastName,
      email,
      password: "***",
      birthDate,
    });
    console.log("Payload being sent to API:", JSON.stringify(body, null, 2));

  const response = await fetch(`${apiUrl}/api/v1/auths/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    console.log("Registration API status:", response.status);
    console.log("Registration API response:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      return {
        success: false,
        message: data.detail || data.message || "Registration failed",
      };
    }

    return {
      success: true,
      message: "Registration successful! Please log in.",
      data: data.payload || data.data,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: error.message || "An error occurred during registration",
    };
  }
}
