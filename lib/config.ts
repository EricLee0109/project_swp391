if (!process.env.BE_BASE_URL) {
  throw new Error("Missing BE_BASE_URL env");
}
export const BE_BASE_URL = process.env.BE_BASE_URL!;
