import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AppointmentListType } from '@/types/ServiceType/StaffRoleType';
import { useState } from 'react';
import { notify } from '@/lib/toastNotify';
import { statusMap } from './helpers';

export default function StatusUpdateDialog({
  appointment,
  open,
  setOpen,
  onSuccess,
}: {
  appointment: AppointmentListType;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: (updatedAppointment: AppointmentListType) => void;
}) {
  const [selectedStatus, setSelectedStatus] = useState<keyof typeof statusMap>(appointment.status as keyof typeof statusMap);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // hàm handleSubmit đã sửa đúng chuẩn
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/appointments/${appointment.appointment_id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedStatus, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Cập nhật trạng thái thất bại');

      notify('success', 'Cập nhật trạng thái thành công');
      setOpen(false);

      // Callback đúng appointment mới nhất
      onSuccess?.(data.appointment || { ...appointment, status: selectedStatus });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      notify('error', err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thay đổi trạng thái cuộc hẹn</DialogTitle>
        </DialogHeader>
        <div className="py-2">
          {(Object.keys(statusMap) as (keyof typeof statusMap)[]).map((status) => (
            <label key={status} className="flex items-center gap-2 py-1 cursor-pointer">
              <input
                type="radio"
                name="status"
                value={status}
                checked={selectedStatus === status}
                onChange={() => setSelectedStatus(status)}
              />
              <span>{statusMap[status]}</span>
            </label>
          ))}
          <textarea
            className="w-full mt-2 border rounded p-2"
            placeholder="Ghi chú (tuỳ chọn)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Huỷ
          </Button>
          <Button onClick={handleSubmit} disabled={loading || selectedStatus === appointment.status}>
            {loading ? 'Đang cập nhật...' : 'Cập nhật'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}