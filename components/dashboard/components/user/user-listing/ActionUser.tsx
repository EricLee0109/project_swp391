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
import { User } from "@/types/user/User";
import { changeUserRole } from "@/app/api/dashboard/chang-role/action";

interface ActionUserProps {
  user: User;
}

export function ActionUser({ user }: ActionUserProps) {
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
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Thay đổi vai trò</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-48 bg-white">
              <DropdownMenuItem
                onClick={async () => {
                  const res = await changeUserRole({
                    userId: user.user_id,
                    newRole: "Customer",
                  });
                  toast(res.message, {
                    description: `Vai trò mới: Khách hàng`,
                  });
                }}
              >
                Khách hàng
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={async () => {
                  const res = await changeUserRole({
                    userId: user.user_id,
                    newRole: "Staff",
                  });
                  toast(res.message, { description: `Vai trò mới: Nhân viên` });
                }}
              >
                Nhân viên
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={async () => {
                  const res = await changeUserRole({
                    userId: user.user_id,
                    newRole: "Admin",
                  });
                  toast(res.message, { description: `Vai trò mới: Admin` });
                }}
              >
                Admin
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={async () => {
                  const res = await changeUserRole({
                    userId: user.user_id,
                    newRole: "Consultant",
                  });
                  toast(res.message, {
                    description: `Vai trò mới: Tư vấn viên`,
                  });
                }}
              >
                Tư vấn viên
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={async () => {
                  const res = await changeUserRole({
                    userId: user.user_id,
                    newRole: "Manager",
                  });
                  toast(res.message, { description: `Vai trò mới: Quản lý` });
                }}
              >
                Quản lý
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

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
