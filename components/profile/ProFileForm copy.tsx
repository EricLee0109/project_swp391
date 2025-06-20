"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 👇 Schema: user_id được optional, vì không gửi lên backend
const formSchema = z.object({
  profile_id: z.string(),
  user_id: z.string().optional(),
  fullName: z.string().min(1, "Họ tên đầy đủ là bắt buộc"),
  address: z.string(),
  birthDate: z.date({
    required_error: "Vui lòng chọn ngày sinh",
  }),
  gender: z.enum(["Male", "Female", "Other"]),
  medical_history: z.string().optional(),
  privacy_settings: z.object({
    shareData: z.boolean(),
    showEmail: z.boolean(),
  }),
});

export default function ProfileForm() {
  const maxFileSize = 1 * 1024 * 1024;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profile_id: "",
      user_id: "", // giữ lại để hiển thị UI thôi
      fullName: "",
      address: "",
      birthDate: undefined,
      gender: "Male",
      medical_history: "",
      privacy_settings: {
        shareData: true,
        showEmail: true,
      },
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    console.log("Ảnh upload:", acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
      },
      maxSize: maxFileSize,
    });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      profile_id: values.profile_id,
      date_of_birth: values.birthDate.toISOString(),
      gender: values.gender,
      medical_history: values.medical_history,
      privacy_settings: values.privacy_settings,
    };

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log("Kết quả cập nhật:", result);
      if (res.ok && result?.success) {
        console.log("✅ Hồ sơ đã được cập nhật:", result.data);
      } else {
        console.error("❌ Lỗi:", result?.error || "Cập nhật thất bại");
      }
    } catch (err) {
      console.error("❌ Lỗi mạng:", err);
    }
  }

  return (
    <div className="py-5">
      <div className="bg-white p-5 drop-shadow">
        <h1 className="text-xl font-semibold">Hồ sơ của tôi</h1>
        <p className="text-sm text-zinc-500">Quản lý thông tin cá nhân</p>
        <hr className="my-3" />

        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập họ và tên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập địa chỉ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Ngày sinh</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? formatDate(field.value)
                                : "Chọn ngày sinh"}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() ||
                              date < new Date("1900-01-01")
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giới tính</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn giới tính" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Nam</SelectItem>
                          <SelectItem value="Female">Nữ</SelectItem>
                          <SelectItem value="Other">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="medical_history"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiền sử bệnh</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tiền sử bệnh" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="privacy_settings.shareData"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!m-0">
                        Cho phép chia sẻ dữ liệu
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="privacy_settings.showEmail"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!m-0">
                        Hiển thị email công khai
                      </FormLabel>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-400 text-white"
                >
                  Lưu thay đổi
                </Button>
              </form>
            </Form>
          </div>

          <div className="col-span-4 py-5">
            <div className="flex justify-center">
              <Image
                src="https://github.com/shadcn.png"
                alt="avatar"
                width={144}
                height={144}
                className="rounded-full object-cover"
              />
            </div>
            <p className="text-center font-medium my-2">
              Cập nhật ảnh đại diện
            </p>
            <div
              {...getRootProps()}
              className="border-dashed border-2 border-pink-500 p-3 text-center text-sm rounded-lg cursor-pointer"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Thả tệp vào đây ...</p>
              ) : isDragReject ? (
                <p className="text-red-500">File không được hỗ trợ</p>
              ) : (
                <p>Kéo và thả ảnh hoặc nhấp để chọn (tối đa 1MB)</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
