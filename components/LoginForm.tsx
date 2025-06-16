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
import { loginAction } from "@/app/api/auth/login/action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
          const result = await loginAction(data);
          localStorage.setItem("accessToken", result.accessToken);
          console.log("Login success:", result);
          toast.success("Đăng nhập thành công");
          setMessage("Đăng nhập thành công!");
          console.log("Login success:", result);
          
          router.refresh();
          router.push("/");
        } else if (loginType === "google") {
          googleSignIn();
        } else if (loginType === "github") {
          githubSignIn();
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setMessage(error.message);
        } else {
          toast.error("Đăng nhập thất bại");
          setMessage("Đăng nhập thất bại!");
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
                    <>Login with Github</>
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
                    <>Login with Google</>
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
