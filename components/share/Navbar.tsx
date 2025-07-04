import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

import { auth } from "@/auth";
import { authJWT } from "@/lib/auth";
import ProfileMenu from "../profile/profile-menu";

type ProfileUserType = {
  name?: string | null;
  fullName?: string | null;
  email?: string | null;
  avatar?: string | null;
};

export default async function Navbar() {
  const session = await authJWT();
  const ggSession = await auth();

  let user = null;
  let type: "jwt" | "oauth" | null = null;
  if (session?.user) {
    user = session.user;
    type = "jwt";
  } else if (ggSession?.user) {
    // uncommand when solve ggSession
    // user = ggSession.user;
    type = "oauth";
  }

  const profileUser: ProfileUserType = {
    name: user?.name || "User",
    fullName: user?.fullName || user?.full_name || "Default user",
    email: user?.email || "example@gmail.com",
    avatar: user?.avatar || "/shadcn.png",
  };

  return (
    <header className="px-5 py-3 bg-white    font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href={"/"}>
          <Image src={"/logo.png"} alt="logo" width={144} height={30} />
        </Link>
        <div className="flex items-center gap-5 text-black">
          {/* <Button asChild>
            <Link href={"/sexualHealthServices"}>Health Services</Link>
          </Button> */}
          {/* {user && type && (
            <Button asChild>
              <Link href={"/menstrualCycle"}>Menstrual Cycle</Link>
            </Button>
          )} */}

          {user && type && <ProfileMenu user={profileUser} type={type} />}

          {!user && (
            <>
              <Button asChild>
                <Link href={"/login"}>Sign In</Link>
              </Button>
              <button>
                <Link href={"/sign-up-otp"}> Sign up</Link>
              </button>
            </>
          )}
        </div>
        {/* <div>
          {session?.user || ggSession?.user ? (
            <div className="flex items-center gap-5 text-black">
              <Button asChild>
                <Link href={`/dashboard/${session.user.role}`}>Dashboard</Link>
              </Button>
              <Button asChild>
                <Link href={"/sexualHealthServices"}>Health Services</Link>
              </Button>
              <Button asChild>
                <Link href={"/menstrualCycle"}>Menstrual Cycle</Link>
              </Button>
              {session?.user && <LogoutButton type="jwt" />}
              {ggSession?.user && <LogoutButton type="oauth" />} */}

        {/* <Link
                href={`/user/${session?.user.user_id || ggSession?.user.id}`}
              >
                <span>{session?.user.email || ggSession?.user.name}</span>
              </Link> */}

        {/* </div>
          ) : (
            <div className="flex items-center gap-5 text-black">
              <Button asChild>
                <Link href={"/sexualHealthServices"}>Health Services</Link>
              </Button>
              <Button asChild>
                <Link href={"/menstrualCycle"}>Menstrual Cycle</Link>
              </Button>

              <Button asChild>
                <Link href={"/login"}>Sign In</Link>
              </Button>
              <button>
                <Link href={"/signup"}> Sign up</Link>
              </button>
            </div>
          )}
        </div> */}
      </nav>
    </header>
  );
}
