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

// Define available modes for each service type
const SERVICE_MODE_OPTIONS = {
  Testing: [
    { value: "AT_HOME", label: "Tại nhà" },
    { value: "AT_CLINIC", label: "Tại phòng khám" }
  ],
  Consultation: [
    { value: "ONLINE", label: "Trực tuyến" },
    { value: "AT_CLINIC", label: "Tại phòng khám" }
  ]
} as const;

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

  // Handle service type change - reset available_modes when type changes
  const handleTypeChange = (newType: "Testing" | "Consultation") => {
    setFormData({ 
      ...formData, 
      type: newType,
      available_modes: [] // Reset available modes when type changes
    });
  };

  const handleCheckboxChange = (mode: "AT_HOME" | "AT_CLINIC" | "ONLINE") => {
    const current = formData.available_modes || [];
    if (current.includes(mode)) {
      setFormData({
        ...formData,
        available_modes: current.filter((m) => m !== mode),
      });
    } else {
      setFormData({ ...formData, available_modes: [...current, mode] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation: Check if at least one mode is selected
    if (!formData.available_modes || formData.available_modes.length === 0) {
      notify("error", "Vui lòng chọn ít nhất một hình thức dịch vụ");
      return;
    }

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
          notify("success", "Tạo dịch vụ thành công!");
        } else if (method === "PATCH") {
          onSave(
            services.map((s) =>
              s.service_id === serviceToEdit?.service_id
                ? (updatedService as ServicesListType)
                : s
            )
          );
          notify("success", "Cập nhật dịch vụ thành công!");
        }
        onClose();
      } else {
        toast.error(data?.error || "Không thể lưu dịch vụ.");
      }
    } catch {
      notify("error", "Lỗi mạng. Vui lòng thử lại.");
    }
  };

  // Get available options based on current service type
  const availableOptions = SERVICE_MODE_OPTIONS[formData.type as keyof typeof SERVICE_MODE_OPTIONS] || SERVICE_MODE_OPTIONS.Testing;

  // Check if return address should be shown (for AT_CLINIC mode or Testing services)
  const shouldShowReturnAddress = formData.available_modes?.includes("AT_CLINIC") || formData.type === "Testing";
  
  // Check if return phone should be shown (for AT_CLINIC mode or Testing services)
  const shouldShowReturnPhone = formData.available_modes?.includes("AT_CLINIC") || formData.type === "Testing";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) onClose();
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-blue-200 text-blue-500 hover:bg-blue-100 hover:text-blue-600">
          Tạo dịch vụ mới
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">

        <DialogHeader>
          <DialogTitle>
            {serviceToEdit ? "Chỉnh sửa dịch vụ" : "Tạo dịch vụ mới"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Tên dịch vụ</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Mô tả</Label>
              <Input
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Giá</Label>
              <Input
                id="price"
                type="number"
                value={formData.price || ""}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Danh mục</Label>
              <Input
                id="category"
                value={formData.category || ""}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="daily_capacity">Số lượng tối đa mỗi ngày</Label>
              <Input
                id="daily_capacity"
                type="number"
                value={formData.daily_capacity || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    daily_capacity: parseInt(e.target.value, 10) || 0,
                  })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="is_active">Trạng thái</Label>
              <select
                id="is_active"
                value={formData.is_active ? "true" : "false"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_active: e.target.value === "true",
                  })
                }
                className="w-full border p-2 rounded"
              >
                <option value="true">Hoạt động</option>
                <option value="false">Ngưng hoạt động</option>
              </select>
            </div>
            <div>
              <Label htmlFor="type">Loại dịch vụ</Label>
              <select
                id="type"
                value={formData.type || "Testing"}
                onChange={(e) =>
                  handleTypeChange(e.target.value as "Testing" | "Consultation")
                }
                className="w-full border p-2 rounded"
              >
                <option value="Consultation">Tư vấn</option>
                <option value="Testing">Xét nghiệm</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <Label>
                Hình thức dịch vụ <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-4 mt-2">
                {availableOptions.map((option) => (
                  <label key={option.value} className="flex items-center gap-2">
                    <Checkbox
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      checked={formData.available_modes?.includes(option.value as any)}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onCheckedChange={() => handleCheckboxChange(option.value as any)}
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formData.type === "Consultation" 
                  ? "Dịch vụ tư vấn có thể thực hiện trực tuyến hoặc tại phòng khám"
                  : "Dịch vụ xét nghiệm có thể thực hiện tại nhà hoặc tại phòng khám"
                }
              </p>
              {formData.available_modes && formData.available_modes.length === 0 && (
                <p className="text-sm text-red-500 mt-1">
                  Vui lòng chọn ít nhất một hình thức dịch vụ
                </p>
              )}
            </div>
            
            {/* Show return address for Testing services or any service with AT_CLINIC mode */}
            {shouldShowReturnAddress && (
              <div>
                <Label htmlFor="return_address">
                  {formData.type === "Testing" ? "Địa chỉ trả kết quả" : "Địa chỉ phòng khám"} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="return_address"
                  value={formData.return_address || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, return_address: e.target.value })
                  }
                  placeholder={formData.type === "Testing" ? "Địa chỉ trả kết quả xét nghiệm" : "Nhập địa chỉ phòng khám"}
                  required
                />
              </div>
            )}
            
            {/* Show return phone for Testing services or any service with AT_CLINIC mode */}
            {shouldShowReturnPhone && (
              <div>
                <Label htmlFor="return_phone">
                  {formData.type === "Testing" ? "Số điện thoại trả kết quả" : "Số điện thoại phòng khám"}
                </Label>
                <Input
                  id="return_phone"
                  value={formData.return_phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, return_phone: e.target.value })
                  }
                  placeholder={formData.type === "Testing" ? "Số điện thoại liên hệ trả kết quả" : "Số điện thoại liên hệ phòng khám"}
                />
              </div>
            )}
          </div>
          
          {/* Service type specific information */}
          <div className="p-3 bg-gray-50 rounded-lg border">
            <h4 className="font-medium text-sm mb-2">
              Thông tin loại dịch vụ: {formData.type === "Consultation" ? "Tư vấn" : "Xét nghiệm"}
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {formData.type === "Consultation" ? (
                <>
                  <li>• Trực tuyến: Tư vấn qua video call hoặc chat</li>
                  <li>• Tại phòng khám: Tư vấn trực tiếp với bác sĩ tại địa chỉ phòng khám</li>
                </>
              ) : (
                <>
                  <li>• Tại nhà: Nhân viên sẽ gửi bộ kit xét nghiệm</li>
                  <li>• Tại phòng khám: Khách hàng đến phòng khám để xét nghiệm</li>
                </>
              )}
            </ul>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              {serviceToEdit ? "Cập nhật" : "Tạo dịch vụ"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}