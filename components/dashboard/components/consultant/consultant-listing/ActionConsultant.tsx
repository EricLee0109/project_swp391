"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { ConsultantGetAll } from "@/types/user/CustomServiceType";
import Image from "next/image";
import { ViewCreatedCalendar } from "@/types/ViewCreatedCalendar/ViewCreatedCalendar";
import { getAvailableSchedulesByConsultant } from "@/app/api/dashboard/ViewCreatedCalendar/action";
import { DataTable } from "../../ViewCreatedCalendar/consultant-listing/data-table";
import { columns } from "../../ViewCreatedCalendar/consultant-listing/columns";

interface ActionUserProps {
  user: ConsultantGetAll;
  onRoleChanged: () => void;
}

export function ActionConsultant({ user }: ActionUserProps) {
  const [showDetail, setShowDetail] = useState(false);
  const [showSchedules, setShowSchedules] = useState(false);
  const [schedules, setSchedules] = useState<ViewCreatedCalendar[]>([]);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedSchedules = schedules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewSchedules = async () => {
    setShowSchedules(true);
    setLoading(true);
    try {
      const data = await getAvailableSchedulesByConsultant(
        user.consultant.consultant_id
      );
      if (data) setSchedules(data);
      else toast.error("Không thể lấy danh sách lịch.");
    } catch {
      toast.error("Lỗi khi tải lịch.");
    } finally {
      setLoading(false);
    }
  };

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
              navigator.clipboard.writeText(user.consultant.consultant_id);
              toast.success("Đã sao chép ID tài khoản.");
            }}
          >
            Sao chép ID tài khoản
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setShowDetail(true)}>
            Xem chi tiết tài khoản
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleViewSchedules}>
            Xem danh sách lịch hẹn
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

      {/* Modal chi tiết tài khoản */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết tài khoản</DialogTitle>
          </DialogHeader>
          <div className="flex items-start gap-6">
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
            <div className="flex-1 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-2">
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

      {/* Modal xem lịch hẹn */}
      <Dialog open={showSchedules} onOpenChange={setShowSchedules}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Lịch hẹn của {user.full_name}</DialogTitle>
          </DialogHeader>
          {loading ? (
            <div className="text-center text-sm py-6">Đang tải dữ liệu...</div>
          ) : schedules.length === 0 ? (
            <div className="text-center text-sm py-6">
              Không có lịch hẹn nào.
            </div>
          ) : (
            <DataTable
              columns={columns()}
              data={paginatedSchedules} // ✅ chỉ hiển thị theo trang
              pageIndex={currentPage - 1} // ✅ vì DataTable dùng index 0-based
              pageSize={itemsPerPage}
              total={schedules.length}
              onPageChange={(page) => setCurrentPage(page)} // ✅ cập nhật trang
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
