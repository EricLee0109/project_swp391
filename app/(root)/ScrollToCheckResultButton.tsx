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
      className="font-semibold text-black-100 bg-white hover:bg-primary-500 hover:text-white transition-colors duration-300 shadow-lg w-full py-3 rounded-lg"
    >
      Kiểm tra kết quả xét nghiệm ngay
    </Button>
  );
}
