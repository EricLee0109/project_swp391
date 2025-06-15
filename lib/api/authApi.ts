// import { BE_BASE_URL } from "@/lib/config";

// // Call BE login API
// export async function loginToBE(email: string, password: string) {
//   const response = await fetch(`${BE_BASE_URL}/auth/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Login failed");
//   }
//   return data;
// }

// // Call BE signup API
// export async function signupToBE(email: string, password: string, fullName: string) {
//   const response = await fetch(`${BE_BASE_URL}/auth/signup`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json; charset=UTF-8" },
//     body: JSON.stringify({ email, password, fullName }),
//   });

//   const data = await response.json();
//   console.log("BE response:", data);

//   if (!response.ok) {
//     throw new Error(data.message || "Signup failed");
//   }
//   return data;
// }
