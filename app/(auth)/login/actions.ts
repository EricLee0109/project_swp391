"use server";

import { signIn, signOut } from "@/auth"; // Make sure path to auth.ts is correct
import { AuthError } from "next-auth";

// Redirect path
const DEFAULT_LOGIN_REDIRECT = "/"; //change this to your redirect path

// Provider Logins (Google, GitHub, etc.)
export async function googleSignIn() {
  await signIn("google", { redirectTo: DEFAULT_LOGIN_REDIRECT });
}

export async function githubSignIn() {
  await signIn("github", { redirectTo: DEFAULT_LOGIN_REDIRECT });
}

// Sign out function
export async function signOutAuth() {
  // Use the signOut function from next-auth to log out
  await signOut({ redirectTo: DEFAULT_LOGIN_REDIRECT }); // Redirect to home after sign out
}

// Credentials Login (Email/Password)
export async function credentialsSignIn(formData: FormData) {
  try {
    // For credentials, signIn will not redirect automatically if you are
    // calling it from a server action. It will only throw an error on failure.
    // The redirect happens upon success, handled by NextAuth.js middleware.
    await signIn("credentials", {
      ...Object.fromEntries(formData), // Pass form data
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid username or password." };
        default:
          return { error: "An unexpected error occurred." };
      }
    }
    // A non-AuthError occurred, re-throw it to be handled globally
    throw error;
  }
}
