import ProfileLayout from "@/components/profile/ProfileLayout";
import { authJWT } from "@/lib/auth";

// 1. Define the specific type you want to pass to the component.
type ProfileUserType = {
  name?: string | null;
  fullName?: string | null;
  email?: string | null;
  avatar?: string | null;
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await authJWT();
  //use when need, command to deploy
  // const ggSession = await auth(); // from next-auth

  // The full user object from either session
  const fullUser = session?.user || null;

  if (!fullUser) {
    return <div>Không tìm thấy thông tin người dùng.</div>;
  }

  // 2. Create the smaller, specific user object.
  // This maps properties from the potentially large `fullUser` object
  // to the lean `profileUser` object.
  const profileUser: ProfileUserType = {
    name: fullUser.name || "Default user",
    fullName: fullUser.fullName || fullUser.full_name || "Default user",
    email: fullUser.email || "example@gmail.com",
    avatar: fullUser.avatar || "/shadcn.png",
  };

  const type = session?.user ? "jwt" : "oauth";

  return (
    <ProfileLayout user={profileUser} type={type}>
      {children}
    </ProfileLayout>
  );
}
