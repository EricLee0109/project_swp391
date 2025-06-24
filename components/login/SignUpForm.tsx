"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { signupAction } from "@/app/api/auth/signup/actions";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

// ✅ Zod schema with OTP
const signupSchema = z
  .object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
    confirmPassword: z.string().min(6, "Xác nhận mật khẩu không được để trống"),
    fullName: z.string().min(3, "Họ tên không được để trống"),
    otpCode: z.string().length(6, "Mã OTP gồm 6 chữ số"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signupSchema>;

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || ""; // lấy email từ URL
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: emailFromUrl,
      password: "",
      confirmPassword: "",
      fullName: "",
      otpCode: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const router = useRouter();

  const onSubmit = (data: SignUpFormValues) => {
    setMessage("");

    startTransition(async () => {
      try {
        await signupAction({
          email: data.email,
          password: data.password,
          fullName: data.fullName,
          otpCode: data.otpCode, //  truyền otp xuống backend
        });

        toast.success("Đăng ký thành công!");
        router.push("/login");
        setMessage("Đăng ký thành công!");
        form.reset();
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
          setMessage(error.message);
        } else {
          toast.error("Đăng ký thất bại!");
          setMessage("Đăng ký thất bại!");
        }
      }
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create Account</CardTitle>
          <CardDescription>Sign up for a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                readOnly
                {...form.register("email")}
              />

              {form.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Your name"
                {...form.register("fullName")}
              />
              {form.formState.errors.fullName && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.fullName.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
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

            <div className="grid gap-3">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="********"
                {...form.register("confirmPassword")}
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="otpCode">OTP</Label>
              <Input
                id="otpCode"
                type="text"
                placeholder="Nhập mã 6 số"
                maxLength={6}
                {...form.register("otpCode")}
              />
              {form.formState.errors.otpCode && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.otpCode.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Đang đăng ký..." : "Sign Up"}
            </Button>

            {message && <p className="text-center text-red-500">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
