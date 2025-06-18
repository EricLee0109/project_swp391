import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { logout } from "@/app/api/auth/actions/logout";

export default async function Navbar() {
  const session = await auth();
  console.log("Session:", session);

  return (
    <header className="px-5 py-3 bg-white shadow-2xl font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href={"/"}>
          <Image src={"/logo.png"} alt="logo" width={144} height={30} />
        </Link>
        <div>
          {session?.user ? (
            <div className="flex items-center gap-5 text-black">
              {/* <Button asChild>
                <Link href={`/dashboard/${session.user.role}`}>Dashboard</Link>
              </Button> */}
              <Button asChild>
                <Link href={"/menstrualCycle"}>Menstrual Cycle</Link>
              </Button>
              <form
                action={async () => {
                  "use server";
                  await logout();
                }}
              >
                <Button type="submit" variant="outline">
                  Logout
                </Button>
              </form>
              <Link href={`/user/${session.user.user_id}`}>
                <span>{session.user.email}</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-5 text-black">
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
        </div>
      </nav>
    </header>
  );
}
