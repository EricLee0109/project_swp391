// app/profile/layout.tsx
import { ReactNode } from "react";
import ProfileLayout from "@/components/profile/ProfileLayout";
import { authJWT } from "@/lib/auth";

// Import type chính xác
import { User } from "@/types/user/User";
import Breadcrumb from "@/components/share/Breadcrumb";

// Chỉ lấy field cần thiết để dùng cho UI
type ProfileUserType = {
  full_name: string;
  email: string;
  image: string | null;
};

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await authJWT();

  if (!session?.user) {
    return <div>Không tìm thấy thông tin người dùng.</div>;
  }

  const fullUser = session.user as User;

  // Map sang object nhỏ gọn để truyền qua ProfileLayout
  const profileUser: ProfileUserType = {
    full_name: fullUser.full_name || "Người dùng",
    email: fullUser.email || "example@gmail.com",
    image: fullUser.image || null,
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Trang cá nhân", href: "/profile" },
          // { label: "Chi tiết", href: `/blog/` },
        ]}
      />
      <ProfileLayout user={profileUser} type="jwt">
        {children}
      </ProfileLayout>
    </>
  );
}
