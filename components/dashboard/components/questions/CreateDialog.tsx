import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { CreateBlog } from "@/types/blog/blog";

interface CreateBlogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (blog: CreateBlog) => void;
  loading?: boolean;
}

export default function CreateBlogDialog({
  open,
  onOpenChange,
  onSubmit,
  loading = false,
}: CreateBlogDialogProps) {
  const form = useForm<CreateBlog>({
    defaultValues: {
      title: "",
      content: "",
      category: "",
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        title: "",
        content: "",
        category: "",
      });
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm blog mới</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              onSubmit(values);
            })}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <input
                      className="w-full border p-2"
                      {...field}
                      placeholder="Tiêu đề"
                      disabled={loading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nội dung</FormLabel>
                  <FormControl>
                    <textarea
                      className="w-full border p-2"
                      {...field}
                      placeholder="Nội dung"
                      disabled={loading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phân loại</FormLabel>
                  <FormControl>
                    <input
                      className="w-full border p-2"
                      {...field}
                      placeholder="Phân loại"
                      disabled={loading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Đang thêm..." : "Thêm blog"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
