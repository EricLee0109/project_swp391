"use client";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/dashboard/header";
import { Skeleton } from "@/components/ui/skeleton";
import { notify } from "@/lib/toastNotify";
import { CreateBlog, EditBlog, GETBlog } from "@/types/blog/blog";
import { columns } from "@/components/dashboard/components/blogs/columns";
import { Button } from "@/components/ui/button";
import UpdateBlogDialog from "@/components/dashboard/components/blogs/UpdateDialog";
import CreateBlogDialog from "@/components/dashboard/components/blogs/CreateDialog";

export default function ManageBlogsClient() {
  const [blogs, setBlogs] = useState<GETBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //Edit Dialog
  const [editBlog, setEditBlog] = useState<EditBlog>();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  //Create Dialog
  //   const [createBlog, setCreateBlog] = useState<CreateBlog>();
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);

  //Edit dialog
  const handleOpenEditDialog = () => {
    setDialogOpen(!dialogOpen);
  };
  const handleEditDialog = (blog: EditBlog) => {
    setDialogOpen(!dialogOpen);
    console.log(blog, "editblog");
    setEditBlog(blog);
  };

  //Create dialog
  const handleOpenCreateDialog = () => {
    setCreateDialogOpen(!createDialogOpen);
  };
  const handleCreateDialog = () => {
    setCreateDialogOpen(!createDialogOpen);
  };
  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch("/api/blog");
        const apiRes = await res.json();
        console.log(apiRes, "apiRessssssssss");
        if (res.ok) {
          setBlogs(apiRes.blogs || []);
        } else {
          setError(apiRes?.error || "Không thể tải danh sách blog.");
          notify("error", apiRes?.error || "Không thể tải danh sách blog.");
        }
      } catch {
        setError("Lỗi mạng. Vui lòng thử lại.");
        notify("error", "Lỗi mạng. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  const handleDeleted = async (id: string) => {
    try {
      const res = await fetch("/api/blog", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Xoá blog thất bại");
      setBlogs((prev) => prev.filter((b) => b.post_id !== id));
      notify("success", "Đã xoá blog");
    } catch {
      notify("error", "Không thể xoá blog");
    }
  };

  const handleUpdateSubmit = async (updated: EditBlog) => {
    try {
      const res = await fetch("/api/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Cập nhật blog thất bại");
      const result = await res.json();
      setBlogs((prev) =>
        prev.map((item) =>
          item.post_id === updated.post_id
            ? {
                ...item,
                ...updated,
                ...result,
              } //create new object to update
            : item
        )
      );
      setDialogOpen(false);
      setEditBlog(undefined);
      notify("success", "Đã cập nhật blog");
    } catch {
      notify("error", "Không thể cập nhật blog");
    }
  };

  const handleAdded = async (blog: CreateBlog) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blog),
      });
      if (!res.ok) throw new Error("Cập nhật blog thất bại");
      const result = await res.json();
      console.log(result, "resulttt");
      setBlogs((prev) => [result.blog, ...prev]); //add new element to the first of the array
      setCreateDialogOpen(false);
      //   setCreateBlog(undefined);
      notify("success", "Đã đăng blog thành công");
    } catch {
      notify("error", "Không thể đăng blog");
    } finally {
      setIsLoading(false);
    }
  };
  console.log(blogs, "blogssss");

  if (loading) {
    return (
      <div className="py-5">
        <Card className="p-6">
          <Skeleton className="h-6 w-1/3 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-5">
        <Card className="p-6">
          <p className="text-center text-destructive">{error}</p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Quản lý blog"
        href="/dashboard/blogs/view"
        currentPage="Theo dõi blog"
      />
      <div className="container mx-auto p-6">
        <div className="ml-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Theo dõi blog</h1>
            <p className="text-muted-foreground">
              Được giám sát bởi - Quản trị viên
            </p>
            <Button onClick={handleCreateDialog}>Thêm blog</Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Các blog</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns({
                  onDeleted: handleDeleted,
                  onUpdated: handleEditDialog,
                  //   onAdded: handleAdded,
                })}
                data={blogs}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      {dialogOpen && (
        <UpdateBlogDialog
          editBlog={editBlog ?? null}
          setEditBlog={setEditBlog}
          onOpenChange={handleOpenEditDialog}
          onSubmit={handleUpdateSubmit}
          open
        />
      )}
      {createDialogOpen && (
        <CreateBlogDialog
          onSubmit={handleAdded}
          onOpenChange={handleOpenCreateDialog}
          open
          loading={isLoading}
        />
      )}
    </div>
  );
}
