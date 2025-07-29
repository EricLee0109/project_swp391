"use client";

import { Button } from "@/components/ui/button";
import { notify } from "@/lib/toastNotify";
import { MessageSquare } from "lucide-react";

export default function DirectMessageButton() {
  const handleMessage = () => {
    // Notify user that the messaging feature is not implemented yet
    notify(
      "info",
      "Chức năng nhắn tin chưa được phát triển, vui lòng liên hệ trực tiếp qua sdt hoặc email."
    );
  };

  return (
    <Button
      onClick={handleMessage}
      variant="outline"
      className="w-full border-2 border-blue-200 text-blue-600 hover:bg-blue-50 py-3 rounded-lg transition-all duration-200"
    >
      <MessageSquare className="w-4 h-4 mr-2" />
      Nhắn tin trực tiếp
    </Button>
  );
}
