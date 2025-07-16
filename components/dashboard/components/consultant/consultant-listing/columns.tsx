import { ColumnDef } from "@tanstack/react-table";
import { ConsultantGetAll } from "@/types/user/CustomServiceType";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ActionConsultant } from "./ActionConsultant";


let currentSearchQuery = "";

export function setSearchQueryForHighlight(query: string) {
  currentSearchQuery = query.trim().toLowerCase();
}

function highlight(text: string): string {
  if (!currentSearchQuery) return text;
  const regex = new RegExp(`(${currentSearchQuery})`, "gi");
  return text.replace(
    regex,
    `<span class="bg-yellow-200 font-semibold">$1</span>`
  );
}

export const columns = (
  onRoleChanged: () => void
): ColumnDef<ConsultantGetAll>[] => [
  {
    id: "stt",
    header: "STT",
    cell: ({ row, table }) => {
      const meta = table.options.meta as { pageIndex: number; pageSize: number };
      const pageIndex = meta?.pageIndex ?? 0;
      const pageSize = meta?.pageSize ?? 10;
      return pageIndex * pageSize + row.index + 1;
    },
  },
 
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 m-0 w-full justify-start"
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div
        dangerouslySetInnerHTML={{
          __html: highlight(row.original.email),
        }}
      />
    ),
  },
  {
    accessorKey: "full_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 m-0 w-full justify-start"
      >
        Họ và tên
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div
        dangerouslySetInnerHTML={{
          __html: highlight(row.original.full_name),
        }}
      />
    ),
  },
  {
    accessorKey: "phone_number",
    header: "SĐT",
    cell: ({ row }) => row.original.phone_number || "—",
  },
 
  {
    accessorKey: "consultant.specialization",
    header: "Chuyên môn",
    cell: ({ row }) => row.original.consultant?.specialization || "—",
  },
  {
    accessorKey: "consultant.qualifications",
    header: "Trình độ",
    cell: ({ row }) => row.original.consultant?.qualifications || "—",
  },
  {
    accessorKey: "consultant.experience",
    header: "Kinh nghiệm",
    cell: ({ row }) => row.original.consultant?.experience || "—",
  },
  {
    accessorKey: "consultant.average_rating",
    header: "Đánh giá",
    cell: ({ row }) =>
      typeof row.original.consultant?.average_rating === "number"
        ? `${row.original.consultant.average_rating} ⭐`
        : "—",
  },
  {
    accessorKey: "is_active",
    header: "Trạng thái",
    cell: ({ row }) =>
      row.original.is_active ? (
        <Badge className="text-green-600 bg-green-200 hover:bg-green-100">
          Đang hoạt động
        </Badge>
      ) : (
        <Badge className="text-red-600 bg-red-200 hover:bg-red-100">
          Không hoạt động
        </Badge>
      ),
  },
  {
    accessorKey: "created_at",
    header: "Ngày tạo",
    cell: ({ row }) =>
      new Date(row.original.created_at).toLocaleDateString("vi-VN"),
  },
  {
    accessorKey: "updated_at",
    header: "Ngày cập nhật",
    cell: ({ row }) =>
      new Date(row.original.updated_at).toLocaleDateString("vi-VN"),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <ActionConsultant user={row.original} onRoleChanged={onRoleChanged} />
    ),
  },
];
