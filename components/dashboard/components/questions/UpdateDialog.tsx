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
import { EditBlog } from "@/types/blog/blog";

interface UpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editBlog: EditBlog | null;
  setEditBlog: (blog: EditBlog) => void;
  onSubmit: (blog: EditBlog) => void;
}

export default function UpdateBlogDialog({
  open,
  onOpenChange,
  editBlog,
  setEditBlog,
  onSubmit,
}: UpdateDialogProps) {
  const form = useForm({
    defaultValues: {
      title: editBlog?.title || "",
      content: editBlog?.content || "",
      category: editBlog?.category || "",
    },
  });
  console.log(editBlog, "editBlogggg");
  // Sync form values when editBlog changes
  useEffect(() => {
    form.reset({
      title: editBlog?.title || "",
      content: editBlog?.content || "",
      category: editBlog?.category || "",
    });
  }, [editBlog, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật blog</DialogTitle>
        </DialogHeader>
        {editBlog && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) => {
                onSubmit({ ...editBlog, ...values });
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
                        onChange={(e) => {
                          field.onChange(e);
                          setEditBlog({ ...editBlog, title: e.target.value });
                        }}
                        placeholder="Tiêu đề"
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
                        onChange={(e) => {
                          field.onChange(e);
                          setEditBlog({ ...editBlog, content: e.target.value });
                        }}
                        placeholder="Nội dung"
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
                      <textarea
                        className="w-full border p-2"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setEditBlog({ ...editBlog, content: e.target.value });
                        }}
                        placeholder="Phân loại"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">Lưu</Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
