import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ConsultantUser } from "@/types/user/User"; // ✅ fix import đúng kiểu


interface ActionUserProps {
  user: ConsultantUser; // ✅ fix kiểu
  onRoleChanged?: () => void;
}

export function ActionConsultant({ user,}: ActionUserProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>

        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(user.user_id);
            toast("Đã sao chép ID tài khoản.");
          }}
        >
          Sao chép ID tài khoản
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link href={`/users/${user.user_id}`}>Xem chi tiết tài khoản</Link>
        </DropdownMenuItem>

        {/* <DropdownMenuSub>
          <DropdownMenuSubTrigger>Thay đổi vai trò</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-48 bg-white">
              {["Customer", "Staff", "Admin", "Consultant", "Manager"].map((role) => (
                <DropdownMenuItem
                  key={role}
                  onClick={async () => {
                    const res = await changeUserRole({
                      userId: user.user_id,
                      newRole: role,
                    });
                    notify("success", `Vai trò mới: ${role}`);
                    if (res.success && onRoleChanged) {
                      onRoleChanged();
                    }
                  }}
                >
                  {role === "Customer"
                    ? "Khách hàng"
                    : role === "Staff"
                    ? "Nhân viên"
                    : role === "Admin"
                    ? "Admin"
                    : role === "Consultant"
                    ? "Tư vấn viên"
                    : "Quản lý"}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub> */}

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Thay đổi trạng thái</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-48 bg-white">
              <DropdownMenuItem>Kích hoạt</DropdownMenuItem>
              <DropdownMenuItem>Hủy kích hoạt</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500">
          Xóa tài khoản
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
