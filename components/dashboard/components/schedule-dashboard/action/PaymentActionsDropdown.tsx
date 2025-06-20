"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { DeleteScheduleDialog } from "./DeleteScheduleDialog";

interface PaymentActionsDropdownProps {
  scheduleId: string;
  onDeleted?: () => void;
}

export function PaymentActionsDropdown({
  scheduleId,
  onDeleted,
}: PaymentActionsDropdownProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(scheduleId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className="text-xl leading-none">...</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white">
        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>

        <DropdownMenuItem onClick={handleCopy}>Sao chép ID</DropdownMenuItem>

        <DropdownMenuItem>Cập nhật</DropdownMenuItem>

        <DropdownMenuItem asChild>
          <DeleteScheduleDialog
            scheduleId={scheduleId}
            onDeleted={onDeleted}
            trigger={
              <span className="text-red-500 cursor-pointer pl-2">Xóa</span>
            }
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
