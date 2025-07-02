import { ColumnDef } from "@tanstack/react-table";
import { ConsultantProfile } from "@/types/user/User";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ActionConsultant } from "./ActionConsultant";

// 🔸 Biến lưu query search để highlight
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
): ColumnDef<ConsultantProfile>[] => [
  {
    id: "stt",
    header: "STT",
    cell: ({ row, table }) => {
      const meta = table.options.meta as {
        pageIndex: number;
        pageSize: number;
      };
      const pageIndex = meta?.pageIndex ?? 0;
      const pageSize = meta?.pageSize ?? 10;
      return pageIndex * pageSize + row.index + 1;
    },
  },
  {
    accessorKey: "user.email",
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
          __html: highlight(row.original.user.email),
        }}
      />
    ),
  },
  {
    accessorKey: "user.full_name",
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
          __html: highlight(row.original.user.full_name),
        }}
      />
    ),
  },
  {
  accessorKey: "specialization",
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="p-0 m-0 w-full justify-start"
    >
      Chuyên môn
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  cell: ({ row }) => row.original.specialization || "—",
},
{
  accessorKey: "qualifications",
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="p-0 m-0 w-full justify-start"
    >
      Trình độ
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  cell: ({ row }) => row.original.qualifications || "—",
},
{
  accessorKey: "experience",
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="p-0 m-0 w-full justify-start"
    >
      Kinh nghiệm
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  cell: ({ row }) => row.original.experience || "—",
},
{
  accessorKey: "average_rating",
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="p-0 m-0 w-full justify-start"
    >
      Đánh giá
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  cell: ({ row }) =>
    typeof row.original.average_rating === "number"
      ? `${row.original.average_rating} ⭐`
      : "—",
},

  {
    accessorKey: "user.is_active",
    header: "Trạng thái",
    cell: ({ row }) =>
      row.original.user.is_active ? (
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
      <ActionConsultant user={row.original.user} onRoleChanged={onRoleChanged} />
    ),
  },
];
