import ProfileLayout from "@/components/profile/ProfileLayout";
import { authJWT } from "@/lib/auth";
import { auth } from "@/auth";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await authJWT();
  const ggSession = await auth();
  const user = session?.user || ggSession?.user;
  const type = session?.user ? "jwt" : "oauth";

  if (!user) {
    // Optional: redirect or return loading/error state
    return <div>Không tìm thấy thông tin người dùng.</div>;
  }

  return (
    <ProfileLayout user={user} type={type}>
      {children}
    </ProfileLayout>
  );
}
