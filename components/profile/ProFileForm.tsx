"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn, formatDate } from "@/lib/utils";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

const formSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(1, "Họ tên đầy đủ là bắt buộc"),
  address: z.string({ required_error: "Vui lòng nhập địa chỉ" }),
  birthDate: z
    .date({ required_error: "Vui lòng nhập ngày sinh" })
    .refine((date) => date <= new Date(), {
      message: "Ngày sinh không hợp lệ",
    }),
});

export default function ProfileForm() {
  const maxFileSize = 1 * 1024 * 1024; // 1MB

  const onDrop = (acceptedFiles: File[]) => {
    console.log("Files dropped:", acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxSize: maxFileSize,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
      address: "",
      birthDate: undefined,
    },
  });



  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitting:", values);
  }



  return (
    <div className="py-5">
      <div className="bg-white p-5 drop-shadow">
        <h1 className="text-xl font-semibold">Hồ sơ của tôi</h1>
        <p className="text-sm text-zinc-500">Quản lý thông tin hồ sơ</p>
        <hr className="my-3" />
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input readOnly placeholder="Nhập địa chỉ email" {...field} />
                      </FormControl>
                      <FormDescription>Email sử dụng để đăng nhập (không thể thay đổi).</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
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
                      <Input placeholder="Nhập địa chỉ" className="py-6" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col my-3">
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
                              {field.value ? formatDate(field.value) : <span>Chọn ngày sinh</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit"  className="bg-pink-500 hover:bg-pink-400">
                  Lưu thay đổi
                </Button>
              </form>
            </Form>
          </div>

          <div className="col-span-4 py-5">
            <div className="flex justify-center">
             <Image
  src="https://github.com/shadcn.png"
  alt="Avatar"
  width={144}
  height={144}
  className="rounded-full object-cover"
/>
            </div>
            <p className="my-3 text-center font-semibold">Cập nhật ảnh đại diện</p>
            <div
              {...getRootProps()}
              className="border-dashed border-2  border-pink-500 text-pink-500 p-3 text-sm rounded-lg text-center cursor-pointer"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Thả các tập tin ở đây ...</p>
              ) : isDragReject ? (
                <p className="text-red-500">File không được hỗ trợ</p>
              ) : (
                <p>Kéo và thả một số tệp ở đây hoặc nhấp để chọn tệp</p>
              )}
              <p>Kích thước tập tin tối đa: 1MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
