import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

import { auth } from "@/auth";
import { authJWT } from "@/lib/auth";
import ProfileMenu from "../profile/profile-menu";
import { User } from "@/types/user/User";
import { RawUser } from "@/types/user/RawUser";

function normalizeUser(raw: RawUser): User {
  return {
    user_id: raw.user_id || raw.id || "",
    full_name: raw.full_name || raw.fullName || raw.name || "Người dùng",
    email: raw.email || "example@gmail.com",
    phone_number: raw.phone_number || "",
    address: raw.address || "",
    image: raw.avatar || raw.image || "/defaultAvatar.png",
    role: raw.role || "Customer",
    is_verified: raw.is_verified ?? false,
    is_active: raw.is_active ?? true,
    customerProfile: raw.customerProfile ?? null,
    consultantProfile: raw.consultantProfile ?? null,
  };
}

export default async function Navbar() {
  const session = await authJWT();
  const ggSession = await auth();

  let user: User | null = null;
  let type: "jwt" | "oauth" | null = null;

  if (session?.user) {
    user = normalizeUser(session.user as RawUser);
    type = "jwt";
  } else if (ggSession?.user) {
    user = normalizeUser(ggSession.user as RawUser);
    type = "oauth";
  }

  return (
    <header className="px-5 py-3 bg-white font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href={"/"}>
          <Image src={"/logo.png"} alt="logo" width={144} height={30} />
        </Link>
        <div className="flex items-center gap-5 text-black">
          {user && type && <ProfileMenu user={user} type={type} />}
          {!user && (
            <>
              <Button asChild>
                <Link href={"/login"}>Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={"/sign-up-otp"}>Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
