"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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
import { CalendarIcon, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import { cn, formatDate } from "@/lib/utils";
import { updateConsultantProfile } from "@/app/api/dashboard/profile-dashboard/action";

const formSchema = z.object({
  fullName: z.string().min(1),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.date({ required_error: "Vui lòng chọn ngày sinh" }),
  gender: z.enum(["Male", "Female", "Other"]),
  medicalHistory: z.string().optional(),
  privacySettings: z.object({
    shareData: z.boolean(),
    showEmail: z.boolean(),
  }),
  qualifications: z.string().optional(),
  experience: z.string().optional(),
  specialization: z.string().optional(),
});

export default function UpdateProfileDashboard() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
      qualifications: "",
      experience: "",
      specialization: "",
    },
  });

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile/me");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi khi fetch profile");

      const user = data?.user || {};
      const profile = data?.consultantProfile || data?.customerProfile || data;

      setRole(user.role);
      setImagePreview(user.image || "");

      form.reset({
        fullName: user.full_name || "",
        phoneNumber: user.phone_number || "",
        address: user.address || "",
        dateOfBirth: profile.date_of_birth
          ? new Date(profile.date_of_birth)
          : undefined,
        gender: profile.gender || "Other",
        medicalHistory: profile.medical_history || "",
        privacySettings:
          typeof profile.privacy_settings === "string"
            ? JSON.parse(profile.privacy_settings)
            : { shareData: true, showEmail: true },
        qualifications: profile.qualifications || "",
        experience: profile.experience || "",
        specialization: profile.specialization || "",
      });
    } catch (err) {
      console.error("❌ Không thể load profile:", err);
    }
  }, [form]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("fullName", values.fullName);
    formData.append("phoneNumber", values.phoneNumber || "");
    formData.append("address", values.address || "");
    formData.append("dateOfBirth", values.dateOfBirth.toISOString());
    formData.append("gender", values.gender);
    formData.append("medicalHistory", values.medicalHistory || "");
    formData.append("privacySettings", JSON.stringify(values.privacySettings));
    if (selectedFile) formData.append("image", selectedFile);

    try {
      const res = await fetch("/api/profile/me", {
        method: "PATCH",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Cập nhật thất bại");

      // Nếu là consultant → gọi API cập nhật thông tin chuyên môn
      if (role === "Consultant") {
        await updateConsultantProfile({
          qualifications: values.qualifications,
          experience: values.experience,
          specialization: values.specialization,
        });
      }

      router.push(`/${role?.toLowerCase()}/dashboard/profile-dashboard`);
    } catch (err) {
      console.error("❌ Lỗi cập nhật:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-5">
      <div className="bg-white p-5 drop-shadow">
        <h1 className="text-xl font-semibold">Cập nhật hồ sơ</h1>
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
                        <Input {...field} />
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
                      <FormLabel>SĐT</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
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
                        <PopoverContent align="start" className="bg-white-100">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            className="rounded-md border shadow-sm"
                            captionLayout="dropdown" //easier to select month, year
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
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
                      <FormLabel className="!m-0">Chia sẻ dữ liệu</FormLabel>
                      <FormMessage />
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
                      <FormLabel className="!m-0">Hiển thị email</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Nếu là Consultant → hiển thị thông tin chuyên môn */}
                {role === "Consultant" && (
                  <>
                    <FormField
                      name="qualifications"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bằng cấp</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="experience"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kinh nghiệm</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="specialization"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chuyên môn</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {!isSubmitting ? (
                  <Button
                    type="submit"
                    className="bg-pink-500 text-white hover:bg-pink-600"
                  >
                    Lưu thay đổi
                  </Button>
                ) : (
                  <Button>
                    <Loader2 className="animate-spin" size={10} /> Đang Lưu...
                  </Button>
                )}
              </form>
            </Form>
          </div>

          {/* Avatar */}
          <div className="col-span-4 py-5">
            <div className="flex justify-center">
              <Image
                src={imagePreview || "/defaultAvatar.png"}
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
              <p>
                {isDragActive ? "Thả ảnh vào đây..." : "Kéo thả hoặc chọn ảnh"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
