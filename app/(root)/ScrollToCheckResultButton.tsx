"use client";
import { Button } from "@/components/ui/button";

export default function ScrollToCheckResultButton() {
  return (
    <Button
      onClick={() => {
        const el = document.getElementById("check-result");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }}
      className="px-6 py-2 bg-white-100 text-pink-500 font-semibold rounded hover:bg-pink-500 hover:text-white transition"
    >
      Kiểm tra kết quả xét nghiệm ngay
    </Button>
  );
}
