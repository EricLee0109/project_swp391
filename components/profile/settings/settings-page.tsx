"use client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";

const SettingsPage = () => {
   const router = useRouter(); // ✅ khởi tạo router
  return (
    <div className="my-3 bg-white py-3 px-5">
      <h1 className="text-xl font-semibold py-3">Cài đặt thông báo</h1>
      <hr />
      <div>
        <div className="flex items-center py-3">
          <div className="flex-1">
            <p className="text-lg">Email thông báo</p>
            <p className="text-sm text-gray-500">
              Thông báo và nhắc nhở quan trọng về tài khoản sẽ không thể bị tắt
            </p>
          </div>
          <Switch checked={true} />
        </div>
        <div className="ps-5">
          <div className="flex items-center py-3">
            <div className="flex-1">
              <p className="text-lg">Cập nhật đơn hàng</p>
              <p className="text-sm text-gray-500">
                Cập nhật về tình trạng vận chuyển của tất cả các đơn hàng
              </p>
            </div>
            <Switch checked={true} />
          </div>
          <div className="flex items-center py-3">
            <div className="flex-1">
              <p className="text-lg">Khuyến mãi</p>
              <p className="text-sm text-gray-500">
                Cập nhật về các ưu đãi và khuyến mãi sắp tới
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center py-3">
            <div className="flex-1">
              <p className="text-lg">Khảo sát</p>
              <p className="text-sm text-gray-500">
                Đồng ý nhận khảo sát để cho chúng tôi được lắng nghe bạn
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </div>
      <hr />
      <div>
        <div className="flex items-center py-3">
          <div className="flex-1">
            <p className="text-lg">Thông báo SMS</p>
            <p className="text-sm text-gray-500">
              Thông báo và nhắc nhở quan trọng về tài khoản sẽ không thể bị tắt
            </p>
          </div>
          <Switch checked={true} />
        </div>
        <div className="ps-5">
          <div className="flex items-center py-3">
            <div className="flex-1">
              <p className="text-lg">Khuyến mãi</p>
              <p className="text-sm text-gray-500">
                Cập nhật về các ưu đãi và khuyến mãi sắp tới
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </div>
      <h1 className="text-xl font-semibold py-3 mt-3">
        Cài đặt quyền riêng tư
      </h1>
      <hr />
      <div className="rounded border border-red-500 overflow-hidden">
        <div className="flex items-center p-3 border">
          <div className="flex-1">
            <p>Cập nhật tài khoản</p>
          </div>
          <Button
            variant={"link"}
            onClick={() => router.push("/profile/update-profile")} 
          >
            Cập nhật
          </Button>
        </div>
        <div className="flex items-center p-3 border">
          <div className="flex-1">
            <p>Thay đổi mật khẩu</p>
          </div>
          <Button variant={"link"}>Thay đổi</Button>
        </div>

        <div className="flex justify-between p-3">
          <p className="text-red-500">Yêu cầu xóa tài khoản</p>
          <Button variant={"destructive"}>Xóa bỏ</Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
