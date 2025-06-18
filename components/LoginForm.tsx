"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useState, useTransition } from "react";
import { githubSignIn, googleSignIn } from "@/app/(auth)/login/actions";
import { useRouter } from "next/navigation";
import { notify } from "@/lib/toastNotify";
const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isPending, startTransition] = useTransition();
  const [pendingProvider, setPendingProvider] = useState<
    "google" | "github" | null
  >(null);
  const [loginType, setLoginType] = useState<"custom" | "google" | "github">(
    "custom"
  ); // ✅ Thêm state loginType
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = (data: LoginFormValues) => {
    setMessage("");
    startTransition(async () => {
      try {
        if (loginType === "custom") {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          console.log("Response from login API:", res);
          if (!res.ok) {
            let message = "Đăng nhập thất bại!";
            try {
              const errorData = await res.json();
              message = errorData.message || message;
            } catch (jsonError) {
              // JSON parse failed (res might be 204 or HTML)
              console.error(
                "Không parse được JSON từ response lỗi:",
                jsonError
              );
            }
            throw new Error(message);
          }
           notify("success", "Đăng nhập thành công!")
          router.refresh(); // Gọi lại Server Component (Navbar)
          router.push("/");
        }
        // Google & GitHub vẫn giữ nguyên
      } catch (error: unknown) {
        if (error instanceof Error) {
          notify("error", error.message);
        } else {
          notify("error", "Đăng nhập thất bại");
        }
      }
    });
  };

  const handleGoogleLogin = () => {
    setPendingProvider("google");
    setLoginType("google");
    googleSignIn();
  };

  const handleGithubLogin = () => {
    setPendingProvider("github");
    setLoginType("github");
    githubSignIn();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-4"
          >
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  type="button"
                  onClick={handleGithubLogin}
                  variant="outline"
                  className="w-full"
                  disabled={pendingProvider === "github"}
                >
                  {pendingProvider === "github" ? (
                    "Redirecting..."
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 0C5.371 0 0 5.372 0 12c0 5.303 3.438 9.799 8.205 11.387.6.111.82-.26.82-.577v-2.173c-3.338.725-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.238 1.838 1.238 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.76-1.605-2.665-.304-5.467-1.332-5.467-5.931 0-1.31.467-2.381 1.235-3.221-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.984-.399 3.003-.404 1.019.005 2.046.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.654 1.653.242 2.873.119 3.176.77.84 1.232 1.911 1.232 3.221 0 4.609-2.807 5.625-5.479 5.922.43.371.814 1.102.814 2.222v3.293c0 .32.216.694.824.576C20.565 21.796 24 17.301 24 12c0-6.628-5.372-12-12-12z"
                        />
                      </svg>
                      <span style={{ marginLeft: 8 }}>Login with GitHub</span>
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  onClick={handleGoogleLogin}
                  variant="outline"
                  className="w-full"
                  disabled={pendingProvider === "google"}
                >
                  {pendingProvider === "google" ? (
                    "Redirecting..."
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="mr-2 h-4 w-4"
                      >
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      <>Login with Google</>
                    </>
                  )}
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    {...form.register("password")}
                  />
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Redirecting..." : "Login"}
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
            {message && <div>{message}</div>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
