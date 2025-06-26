import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user/User";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { ActionUser } from "./ActionUser";

// 🔸 Lưu trữ query tìm kiếm để highlight
let currentSearchQuery = "";

export function setSearchQueryForHighlight(query: string) {
  currentSearchQuery = query.trim().toLowerCase();
}

// 🔸 Hàm highlight đơn giản
function highlight(text: string): string {
  if (!currentSearchQuery) return text;
  const regex = new RegExp(`(${currentSearchQuery})`, "gi");
  return text.replace(
    regex,
    `<span class="bg-yellow-200 font-semibold">$1</span>`
  );
}

export const columns: ColumnDef<User>[] = [
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
        dangerouslySetInnerHTML={{ __html: highlight(row.original.full_name) }}
      />
    ),
  },
  {
    accessorKey: "phone_number",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 m-0 w-full justify-start"
      >
        Số điện thoại
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.phone_number || "—",
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 m-0 w-full justify-start"
      >
        Địa chỉ
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.address || "—",
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 m-0 w-full justify-start"
      >
        Vai trò
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const role = row.original.role;
      switch (role) {
        case "Admin":
          return <Badge className="bg-blue-600 hover:bg-blue-500">Admin</Badge>;
        case "Customer":
          return (
            <Badge className="bg-orange-600 hover:bg-orange-500">
              Khách hàng
            </Badge>
          );
        case "Consultant":
          return (
            <Badge className="bg-purple-600 hover:bg-purple-500">Tư vấn</Badge>
          );
        case "Staff":
          return (
            <Badge className="bg-green-600 hover:bg-green-500">Nhân viên</Badge>
          );
        case "Manager":
          return (
            <Badge className="bg-yellow-600 hover:bg-yellow-500">Quản lý</Badge>
          );
        default:
          return <Badge>{role}</Badge>;
      }
    },
  },

  {
    accessorKey: "customerProfile.gender",
    header: "Giới tính",
    cell: ({ row }) => row.original.customerProfile?.gender || "—",
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
    accessorKey: "is_active",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0 m-0 w-full justify-start"
      >
        Trạng thái
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
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
    id: "actions",
    cell: ({ row }) => <ActionUser user={row.original} />,
  },
];
