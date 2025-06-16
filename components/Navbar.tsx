import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { MessageCircleHeart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="px-5 py-3 bg-white shadow-2xl font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href={"/"}>
          <Image src={"/logo.png"} alt="logo" width={144} height={30} />
        </Link>
        <div>
          {session && session.user ? (
            <div className="flex items-center gap-5 text-black">
              <Link href={"/starup/create"}>
                <Button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">
                  Create Startup
                </Button>
              </Link>
              <Button
                className="text-white-100 hover:bg-red-200 hover:text-black-100 transition-colors duration-300"
                onClick={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                Logout
              </Button>
              <Link href={`/user/${session?.user?.id}`}>
                <button>{session?.user?.name}</button>
              </Link>
            </div>
          ) : (
            // Latest login method with Github (but if did not login yet, github login page will display)
            <div className="flex items-center gap-5 text-black">
              <Button className="hover:text-white bg-none!important">
                <Link href={"/menstrualCycle"}>
                  <div className="flex-between gap-2">
                    <p>Menstrual Cycle</p>
                    <MessageCircleHeart />
                  </div>
                </Link>
              </Button>
              <Button className="hover:text-white ">
                <Link href={"/login"}>Sign in </Link>
              </Button>
              <button>
                <Link href={"/signup"}> Sign up</Link>
              </button>
            </div>

            // The previous login method with Github
            // <form
            //   action={async () => {
            //     "use server";
            //     await signIn();
            //   }}
            // >
            //   <button type="submit" className="text-black">
            //     Login
            //   </button>
            // </form>
          )}
        </div>
      </nav>
    </header>
  );
}
