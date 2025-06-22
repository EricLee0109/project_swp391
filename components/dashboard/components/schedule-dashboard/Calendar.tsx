"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { vi } from "date-fns/locale";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CalendarPickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function CalendarPicker({ selectedDate, onDateChange }: CalendarPickerProps) {
  const [dropdown, setDropdown] = React.useState<
    React.ComponentProps<typeof Calendar>["captionLayout"]
  >("dropdown");

  return (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onDateChange(date)}
        defaultMonth={selectedDate}
        captionLayout={dropdown}
        locale={vi}
        className="rounded-lg border shadow-sm"
      />

      <div className="flex flex-col gap-3">
        <Label htmlFor="dropdown" className="px-1">
          Hiển thị tháng/năm
        </Label>
        <Select
          value={dropdown}
          onValueChange={(value) =>
            setDropdown(value as React.ComponentProps<typeof Calendar>["captionLayout"])
          }
        >
          <SelectTrigger id="dropdown" className="bg-background">
            <SelectValue placeholder="Chọn kiểu dropdown" />
          </SelectTrigger>
          <SelectContent align="center">
            <SelectItem value="dropdown">Tháng & Năm</SelectItem>
            <SelectItem value="dropdown-months">Chỉ Tháng</SelectItem>
            <SelectItem value="dropdown-years">Chỉ Năm</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
