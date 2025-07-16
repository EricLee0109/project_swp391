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
import { notify } from "@/lib/toastNotify";
import { deleteUserById } from "@/app/api/dashboard/user/action";

// import UpdateConsultantDialog from "../UpdateConsultant";

interface ActionUserProps {
  user: User;
  onRoleChanged?: () => void; // ✅ thêm prop
}

export function ActionUser({ user, onRoleChanged }: ActionUserProps) {
  //  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  return (
    <>
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
                    notify("success", "Vai trò mới: Khách hàng");
                    if (res.success && onRoleChanged) {
                      onRoleChanged(); // ✅ gọi lại để load lại danh sách
                    }
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
                    notify("success", "Vai trò mới: Nhân viên");
                    if (res.success && onRoleChanged) {
                      onRoleChanged();
                    }
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

                    notify("success", "Vai trò mới: Admin");
                    if (res.success && onRoleChanged) {
                      onRoleChanged();
                    }
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
                    notify("success", "Vai trò mới: Tư vấn viên");
                    if (res.success && onRoleChanged) {
                      onRoleChanged();
                    }
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

                    notify("success", "Vai trò mới: Quản lý");
                    if (res.success && onRoleChanged) {
                      onRoleChanged();
                    }
                  }}
                >
                  Quản lý
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          {/* <DropdownMenuItem onSelect={() => setOpenUpdateDialog(true)}>
          Cập nhật TTV
        </DropdownMenuItem> */}
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
          <DropdownMenuItem
            className="text-red-500"
            onClick={async () => {
              const confirm = window.confirm(
                "Bạn có chắc muốn xóa tài khoản này?"
              );
              if (!confirm) return;

              const res = await deleteUserById(user.user_id);

              if (res.success) {
                notify("success", res.message);
                if (onRoleChanged) onRoleChanged(); // ✅ gọi lại danh sách nếu cần
              } else {
                notify("error", res.message);
              }
            }}
          >
            Xóa tài khoản
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* <UpdateConsultantDialog
        open={openUpdateDialog}
        onClose={() => setOpenUpdateDialog(false)}
        userId={user.user_id}
      /> */}
    </>
  );
}
