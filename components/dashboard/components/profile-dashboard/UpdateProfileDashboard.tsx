"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  getMyConsultantProfile,
  updateConsultantProfile,
} from "@/app/api/dashboard/profile-dashboard/action";


export default function UpdateProfileDashboard() {
  const [form, setForm] = useState({
    qualifications: "",
    experience: "",
    specialization: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getMyConsultantProfile();
      if (profile) {
        setForm({
          qualifications: profile.qualifications || "",
          experience: profile.experience || "",
          specialization: profile.specialization || "",
        });
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await updateConsultantProfile(form);
    if (res.success) {
      toast.success("Cập nhật thành công");
    } else {
      toast.error(res.message || "Cập nhật thất bại");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-xl font-semibold">Cập nhật hồ sơ tư vấn viên</h2>

      <div>
        <label className="block mb-1 font-medium">Trình độ</label>
        <Input
          value={form.qualifications}
          onChange={(e) =>
            setForm({ ...form, qualifications: e.target.value })
          }
          placeholder="VD: Cử nhân Tâm lý học"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Kinh nghiệm</label>
        <Input
          value={form.experience}
          onChange={(e) =>
            setForm({ ...form, experience: e.target.value })
          }
          placeholder="VD: 5 năm tư vấn trị liệu"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Chuyên môn</label>
        <Input
          value={form.specialization}
          onChange={(e) =>
            setForm({ ...form, specialization: e.target.value })
          }
          placeholder="VD: Trầm cảm, lo âu, tâm lý trẻ"
        />
      </div>

      <div className="pt-4 text-right">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>
    </div>
  );
}
