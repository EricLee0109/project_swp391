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
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { sendForgotPasswordOtp } from "@/app/api/auth/forgot-password/action"; // 👉 đường dẫn action mới

const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const router = useRouter();

  const onSubmit = (data: ForgotPasswordFormValues) => {
    setMessage("");

    startTransition(async () => {
      try {
        await sendForgotPasswordOtp(data.email);
        toast.success("Email khôi phục đã được gửi!");
      
        router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
        form.reset();
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
          setMessage(error.message);
        } else {
          toast.error("Có lỗi xảy ra khi gửi email.");
    
        }
      }
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Quên mật khẩu</CardTitle>
          <CardDescription>
            Nhập email để nhận liên kết đặt lại mật khẩu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
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

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Đang gửi..." : "Gửi liên kết đặt lại mật khẩu"}
            </Button>

            {message && <p className="text-center text-green-600">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
