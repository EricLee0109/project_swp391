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

// 👉 Nếu đã tạo hàm gửi OTP trong action.ts thì import ở đây
import { sendOtp } from "@/app/api/auth/signupotp/action"; // Giả sử bạn đã tạo API client-side

// Schema chỉ cần validate email
const signupSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

type SignUpFormValues = z.infer<typeof signupSchema>;

export function SignUpFormOtp({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const router = useRouter();

  const onSubmit = (data: SignUpFormValues) => {
    setMessage("");

    startTransition(async () => {
      try {
        // 👉 Gọi API gửi OTP
        await sendOtp(data.email);

        toast.success("Mã OTP đã được gửi đến email!");
        setMessage("Mã OTP đã gửi thành công");

        // 👉 Có thể chuyển hướng sang bước nhập mã OTP
        router.push(`/sign-up?email=${encodeURIComponent(data.email)}`);
        form.reset();
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
          setMessage(error.message);
        } else {
          toast.error("Gửi OTP thất bại!");
          setMessage("Có lỗi xảy ra khi gửi OTP");
        }
      }
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Tạo tài khoản</CardTitle>
          <CardDescription>Nhập email để nhận mã OTP</CardDescription>
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
              {isPending ? "Đang gửi mã OTP..." : "Gửi mã OTP"}
            </Button>

            {message && <p className="text-center text-green-600">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
