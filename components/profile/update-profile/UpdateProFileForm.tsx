"use client";

import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatDate } from "@/lib/utils";

// Zod schema
const formSchema = z.object({
  fullName: z.string().min(1),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  // Loại bỏ image khỏi schema vì không cần gửi string URL trực tiếp
  dateOfBirth: z.date({ required_error: "Vui lòng chọn ngày sinh" }),
  gender: z.enum(["Male", "Female", "Other"]),
  medicalHistory: z.string().optional(),
  privacySettings: z.object({
    shareData: z.boolean(),
    showEmail: z.boolean(),
  }),
});

export default function UpdateProfileForm() {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      address: "",
      dateOfBirth: undefined,
      gender: "Other",
      medicalHistory: "",
      privacySettings: {
        shareData: true,
        showEmail: true,
      },
    },
  });

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile/me");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi khi fetch profile");

      form.reset({
        fullName: data.customerProfile.user.full_name || "",
        phoneNumber: data.customerProfile.user.phone_number || "",
        address: data.customerProfile.user.address || "",
        dateOfBirth: data.customerProfile.date_of_birth
          ? new Date(data.customerProfile.date_of_birth)
          : undefined,
        gender: data.customerProfile.gender || "Other",
        medicalHistory: data.customerProfile.medical_history || "",
        privacySettings:
          typeof data.customerProfile.privacy_settings === "string"
            ? JSON.parse(data.customerProfile.privacy_settings)
            : { shareData: true, showEmail: true },
      });

      setImagePreview(data.customerProfile.user.image || "");
    } catch (err) {
      console.error("❌ Không thể load profile:", err);
    }
  }, [form]); // thêm dependency nếu cần

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]); //

  // Upload ảnh
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);
    setSelectedFile(file); // Lưu file để gửi lên server
  };

  // Submit form
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("fullName", values.fullName);
    formData.append("phoneNumber", values.phoneNumber || "");
    formData.append("address", values.address || "");
    formData.append("dateOfBirth", values.dateOfBirth.toISOString());
    formData.append("gender", values.gender);
    formData.append("medicalHistory", values.medicalHistory || "");
    formData.append("privacySettings", JSON.stringify(values.privacySettings));

    // Thêm file ảnh nếu có
    if (selectedFile) {
      formData.append("image", selectedFile); // Gửi tệp hình ảnh
    }

    try {
      const res = await fetch("/api/profile/me", {
        method: "PATCH",
        body: formData, // Sử dụng FormData thay cho JSON
      });

      const result = await res.json();
      console.log("📥 Phản hồi từ API:", result); // Debug

      if (!res.ok) throw new Error(result.error || "Cập nhật thất bại");

      await fetchProfile(); // Lấy dữ liệu mới
      router.push("/manager/dashboard/profile-dashboard");
    } catch (err) {
      console.error("❌ Lỗi cập nhật:", err);
    }
  } 

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
      },
    });

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
                  name="fullName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ tên</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Họ tên đầy đủ" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="phoneNumber"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Số điện thoại" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="address"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Địa chỉ" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="dateOfBirth"
                  control={form.control}
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
                              date > new Date() || date < new Date("1900-01-01")
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="gender"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giới tính</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
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
                  name="medicalHistory"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiền sử bệnh</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Thông tin bệnh án" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  name="privacySettings.shareData"
                  control={form.control}
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
                  name="privacySettings.showEmail"
                  control={form.control}
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
                src={imagePreview || "https://github.com/shadcn.png"}
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
                <p>Thả ảnh vào đây...</p>
              ) : isDragReject ? (
                <p className="text-red-500">File không hợp lệ</p>
              ) : (
                <p>Kéo và thả ảnh hoặc nhấp để chọn</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
