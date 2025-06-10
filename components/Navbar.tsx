import { auth, signIn, signOut } from "@/auth";
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
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">
                  Create Startup
                </button>
              </Link>
              <button
                onClick={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                Logout
              </button>
              <Link href={`/user/${session?.user?.id}`}>
                <button>{session?.user?.name}</button>
              </Link>
            </div>
          ) : (
            // Latest login method with Github (but if did not login yet, github login page will display)
            <div className="flex items-center gap-5 text-black">
              <button
                onClick={async () => {
                  "use server";
                  await signIn("github");
                }}
              >
                Login Gihub
              </button>

              <button
                onClick={async () => {
                  "use server";
                  await signIn("google");
                }}
              >
                Login Google
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
