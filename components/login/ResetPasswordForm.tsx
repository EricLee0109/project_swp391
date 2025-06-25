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
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { resetPasswordWithOtp } from "@/app/api/auth/reset-password/action";



const resetPasswordSchema = z
  .object({
    email: z.string().email("Email không hợp lệ"),
    otpCode: z.string().min(4, "OTP không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(6, "Xác nhận mật khẩu không được để trống"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailFromUrl,
      otpCode: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    startTransition(async () => {
      try {
        await resetPasswordWithOtp({
          email: data.email,
          otpCode: data.otpCode,
          newPassword: data.password,
          
        });

        toast.success("Đặt lại mật khẩu thành công!");
         router.push("/login");
        form.reset();
      } catch  {
        toast.error( "Đặt lại mật khẩu thất bại");
      }
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Đặt lại mật khẩu</CardTitle>
          <CardDescription>
            Nhập thông tin để đổi mật khẩu bằng mã OTP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
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
              <Label htmlFor="otpCode">Mã OTP</Label>
              <Input
                id="otpCode"
                type="text"
                placeholder="Nhập mã OTP"
                {...form.register("otpCode")}
              />
              {form.formState.errors.otpCode && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.otpCode.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="password">Mật khẩu mới</Label>
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
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
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

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Đang xử lý..." : "Xác nhận đặt lại mật khẩu"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
