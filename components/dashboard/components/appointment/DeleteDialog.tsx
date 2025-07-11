import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteDialogProps {
  open: boolean;
  setOpenChange: (open: boolean) => void;
  handleDelete?: () => void;
}

export default function DeleteDialog({
  open,
  setOpenChange,
  handleDelete,
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpenChange}>
      {/* <DialogTrigger>
        <Trash2 className="mr-2 h-4 w-4" />
        <span>Xoá lịch hẹn</span>
      </DialogTrigger> */}
      <DialogContent>
        <AlertDialogHeader>
          <DialogTitle>Xác nhận xóa lịch hẹn</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa lịch hẹn của khách hàng?
          </DialogDescription>
        </AlertDialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={() => setOpenChange(false)} variant={"outline"}>
              Hủy
            </Button>
          </DialogClose>
          <Button onClick={handleDelete}>Xác nhận</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
