"use client";

import Link from "next/link";

export default function SearchFormReset() {
  const reset = () => {
    const form = document.querySelector(".search-form") as HTMLFormElement;

    if (form) {
      form.reset();
    }
  };

  return (
    <button type="reset" onClick={reset}>
      <Link href="/" className="search-btn">
        X
      </Link>
    </button>
  );
}
