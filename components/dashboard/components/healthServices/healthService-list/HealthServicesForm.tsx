"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ServicesListType } from "@/types/ServiceType/StaffRoleType";
import { toast } from "sonner";
import { notify } from "@/lib/toastNotify";

interface HealthServicesFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (services: ServicesListType[]) => void;
  services: ServicesListType[];
  setIsOpen: (open: boolean) => void;
  serviceToEdit?: ServicesListType;
}

export default function HealthServicesForm({
  isOpen,
  onClose,
  onSave,
  services,
  setIsOpen,
  serviceToEdit,
}: HealthServicesFormProps) {
  const [formData, setFormData] = useState<Partial<ServicesListType>>({});

  useEffect(() => {
    if (serviceToEdit) {
      setFormData({
        ...serviceToEdit,
        price: serviceToEdit.price.toString(),
        available_modes: serviceToEdit.available_modes || [],
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        is_active: true,
        type: "Testing",
        available_modes: [],
        daily_capacity: 10,
        return_address: "",
        return_phone: "",
      });
    }
  }, [serviceToEdit]);

  const handleCheckboxChange = (mode: "AT_HOME" | "AT_CLINIC") => {
    const current = formData.available_modes || [];
    if (current.includes(mode)) {
      setFormData({ ...formData, available_modes: current.filter((m) => m !== mode) });
    } else {
      setFormData({ ...formData, available_modes: [...current, mode] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = serviceToEdit ? "PATCH" : "POST";
    const url = serviceToEdit
      ? `/api/services/${serviceToEdit.service_id}`
      : "/api/services";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...formData, price: formData.price || "0" }),
      });
      const data = await res.json();
      if (res.ok) {
        const updatedService = data.data || formData;
        if (method === "POST") {
          onSave([...services, updatedService as ServicesListType]);
          notify("success","Tạo dịch vụ thành công!");
        } else if (method === "PATCH") {
          onSave(
            services.map((s) =>
              s.service_id === serviceToEdit?.service_id
                ? (updatedService as ServicesListType)
                : s
            )
          );
          notify("success","Cập nhật dịch vụ thành công!");
        }
        onClose();
      } else {
        toast.error(data?.error || "Không thể lưu dịch vụ.");
      }
    } catch {
      notify("error","Lỗi mạng. Vui lòng thử lại.");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) onClose();
      }}
    >
      <DialogTrigger asChild>
        <Button>Tạo dịch vụ mới</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{serviceToEdit ? "Chỉnh sửa dịch vụ" : "Tạo dịch vụ mới"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Tên dịch vụ</Label>
              <Input id="name" value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="description">Mô tả</Label>
              <Input id="description" value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="price">Giá</Label>
              <Input id="price" type="number" value={formData.price || ""} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="category">Danh mục</Label>
              <Input id="category" value={formData.category || ""} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="daily_capacity">Số lượng tối đa mỗi ngày</Label>
              <Input id="daily_capacity" type="number" value={formData.daily_capacity || ""} onChange={(e) => setFormData({ ...formData, daily_capacity: parseInt(e.target.value, 10) || 0 })} required />
            </div>
            <div>
              <Label htmlFor="is_active">Trạng thái</Label>
              <select id="is_active" value={formData.is_active ? "true" : "false"} onChange={(e) => setFormData({ ...formData, is_active: e.target.value === "true" })} className="w-full border p-2 rounded">
                <option value="true">Hoạt động</option>
                <option value="false">Ngưng hoạt động</option>
              </select>
            </div>
            <div>
              <Label htmlFor="type">Loại</Label>
              <select id="type" value={formData.type || "Testing"} onChange={(e) => setFormData({ ...formData, type: e.target.value as "Testing" | "Consultation" })} className="w-full border p-2 rounded">
                <option value="Consultation">Tư vấn</option>
                <option value="Testing">Xét nghiệm</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <Label>Hình thức</Label>
              <div className="flex items-center gap-4 mt-1">
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.available_modes?.includes("AT_HOME")}
                    onCheckedChange={() => handleCheckboxChange("AT_HOME")}
                  />
                  Tại nhà
                </label>
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.available_modes?.includes("AT_CLINIC")}
                    onCheckedChange={() => handleCheckboxChange("AT_CLINIC")}
                  />
                  Tại phòng khám
                </label>
              </div>
            </div>
            <div>
              <Label htmlFor="return_address">Địa chỉ trả kết quả</Label>
              <Input id="return_address" value={formData.return_address || ""} onChange={(e) => setFormData({ ...formData, return_address: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="return_phone">Số điện thoại trả kết quả</Label>
              <Input id="return_phone" value={formData.return_phone || ""} onChange={(e) => setFormData({ ...formData, return_phone: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" type="button" onClick={onClose}>Hủy</Button>
            <Button type="submit">Lưu</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}