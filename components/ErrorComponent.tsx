"use client";

import { useEffect } from "react";

export default function ErrorComponent({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl text-red-500 font-bold">Something went wrong!</h2>
      <button onClick={() => reset()} className="mt-4 bg-blue-600 text-white py-2 px-4 rounded">
        Try again
      </button>
    </div>
  );
}
