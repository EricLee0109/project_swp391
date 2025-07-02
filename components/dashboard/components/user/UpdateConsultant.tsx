// "use client";

// import { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import {
//   updateConsultantProfile,
//   getConsultantById,
// } from "@/app/api/consultant/action";
// import { ConsultantProfile } from "@/types/user/User";

// interface Props {
//   open: boolean;
//   onClose: () => void;
//   userId: string;
// }

// export default function UpdateConsultantDialog({
//   open,
//   onClose,
//   userId,
// }: Props) {
//   const [form, setForm] = useState({
//     qualifications: "",
//     experience: "",
//     specialization: "",
//   });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchConsultant = async () => {
//       const data: ConsultantProfile | null = await getConsultantById(userId);
//       if (data) {
//         setForm({
//           qualifications: data.qualifications || "",
//           experience: data.experience || "",
//           specialization: data.specialization || "",
//         });
//       }
//     };

//     if (open && userId) fetchConsultant();
//   }, [open, userId]);

//   const handleUpdate = async () => {
//     setLoading(true);
//     const res = await updateConsultantProfile({
//       ...form,
//       user_id: userId,
//     });
//     if (res.success) {
//       toast.success("Cập nhật thành công");
//       onClose();
//     } else {
//       toast.error(res.message || "Cập nhật thất bại");
//     }
//     setLoading(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-w-lg">
//         <DialogHeader>
//           <DialogTitle>Cập nhật thông tin tư vấn viên</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-3">
//           <Input
//             placeholder="Trình độ"
//             value={form.qualifications}
//             onChange={(e) =>
//               setForm({ ...form, qualifications: e.target.value })
//             }
//           />
//           <Input
//             placeholder="Kinh nghiệm"
//             value={form.experience}
//             onChange={(e) =>
//               setForm({ ...form, experience: e.target.value })
//             }
//           />
//           <Input
//             placeholder="Chuyên môn"
//             value={form.specialization}
//             onChange={(e) =>
//               setForm({ ...form, specialization: e.target.value })
//             }
//           />
//         </div>

//         <div className="pt-4 flex justify-end">
//           <Button onClick={handleUpdate} disabled={loading}>
//             {loading ? "Đang lưu..." : "Lưu"}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
