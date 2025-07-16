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

import { toast } from "sonner";
import { ConsultantGetAll } from "@/types/user/CustomServiceType"; // ✅ đúng type
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import Image from "next/image";

interface ActionUserProps {
  user: ConsultantGetAll; // ✅ chuẩn
  onRoleChanged?: () => void;
}

export function ActionConsultant({ user,  }: ActionUserProps) {
  const [showDetail, setShowDetail] = useState(false);

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
              toast.success("Đã sao chép ID tài khoản.");
            }}
          >
            Sao chép ID tài khoản
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setShowDetail(true)}>
            Xem chi tiết tài khoản
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Thay đổi trạng thái</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent className="w-48 bg-white">
                <DropdownMenuItem
                  onClick={() => toast("Đã kích hoạt tài khoản")}
                >
                  Kích hoạt
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => toast("Đã hủy kích hoạt tài khoản")}
                >
                  Hủy kích hoạt
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-500"
            onClick={() => toast.error("Chưa hỗ trợ xoá tài khoản")}
          >
            Xóa tài khoản
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 👇 Modal chi tiết tài khoản */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết tài khoản</DialogTitle>
          </DialogHeader>

          <div className="flex items-start gap-6">
            {/* Avatar */};
            <div className="flex-shrink-0">
              {user.image ? (
                <Image
                  src={user.image}
                  alt="avatar"
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full object-cover border"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>
            {/* Thông tin tài khoản */}
            <div className="flex-1 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <p>
                  <span className="font-medium">ID:</span> {user.user_id}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-medium">Họ tên:</span> {user.full_name}
                </p>
                <p>
                  <span className="font-medium">SĐT:</span> {user.phone_number}
                </p>
                <p>
                  <span className="font-medium">Địa chỉ:</span> {user.address}
                </p>
                <p>
                  <span className="font-medium">Vai trò:</span> {user.role}
                </p>
                <p>
                  <span className="font-medium">Trạng thái:</span>{" "}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.is_active ? "Đang hoạt động" : "Ngừng hoạt động"}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Xác minh:</span>{" "}
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.is_verified
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {user.is_verified ? "Đã xác minh" : "Chưa xác minh"}
                  </span>
                </p>
              </div>

              <hr className="my-2" />

              <div className="grid grid-cols-2 gap-2">
                <p>
                  <span className="font-medium">Chuyên môn:</span>{" "}
                  {user.consultant?.specialization || "—"}
                </p>
                <p>
                  <span className="font-medium">Trình độ:</span>{" "}
                  {user.consultant?.qualifications || "—"}
                </p>
                <p>
                  <span className="font-medium">Kinh nghiệm:</span>{" "}
                  {user.consultant?.experience || "—"}
                </p>
                <p>
                  <span className="font-medium">Đánh giá:</span>{" "}
                  {typeof user.consultant?.average_rating === "number"
                    ? `${user.consultant.average_rating} ⭐`
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
