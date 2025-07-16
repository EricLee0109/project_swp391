"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Form
} from "@/components/ui/form";


// --- Zod schema ---
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
});

export default function UpdateProfileDashboard() {
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

  // Fetch profile
  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile/me");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Lỗi khi fetch profile");

      const user = data?.user || {};
      const profile = data?.consultantProfile || data?.customerProfile || data;

      form.reset({
        fullName: user.full_name || "",
        phoneNumber: user.phone_number || "",
        address: user.address || "",
        dateOfBirth: profile.date_of_birth ? new Date(profile.date_of_birth) : undefined,
        gender: profile.gender || "Other",
        medicalHistory: profile.medical_history || "",
        privacySettings: typeof profile.privacy_settings === "string"
          ? JSON.parse(profile.privacy_settings)
          : { shareData: true, showEmail: true },
      });

      setImagePreview(user.image || "");
    } catch (err) {
      console.error("❌ Không thể load profile:", err);
    }
  }, [form]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Dropzone
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] },
  });

  // Submit
 const onSubmit = async (values: z.infer<typeof formSchema>) => {
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

    const role = result?.user?.role || result?.role; // fallback nếu server trả `role` trực tiếp

    // ✅ Điều hướng theo vai trò
    switch (role) {
      case "Manager":
        router.push("/manager/dashboard/profile-dashboard");
        break;
      case "Admin":
        router.push("/admin/dashboard/profile-dashboard");
        break;
      case "Staff":
        router.push("/staff/dashboard/profile-dashboard");
        break;
      case "Consultant":
        router.push("/consultant/dashboard/profile-dashboard");
        break;
      default:
      
        break;
    }
  } catch (err) {
    console.error("❌ Lỗi cập nhật:", err);
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                {/* Các field như form mẫu bạn đã đưa (fullName, dateOfBirth, gender, medicalHistory, privacySettings...) */}
                {/* ... giữ nguyên như cũ ở phần bạn đã code ... */}
              </form>
            </Form>
          </div>

          {/* Avatar preview + dropzone */}
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
            <p className="text-center font-medium my-2">Cập nhật ảnh đại diện</p>
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
