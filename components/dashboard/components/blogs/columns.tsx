import { Button } from "@/components/ui/button";
import { EditBlog, GETBlog } from "@/types/blog/blog";
import { ColumnDef } from "@tanstack/react-table";

interface BlogsColumnsProps {
  onDeleted: (id: string) => void;
  onUpdated: (blog: EditBlog) => void;
}

export const columns = ({
  onDeleted,
  onUpdated,
}: BlogsColumnsProps): ColumnDef<GETBlog>[] => {
  return [
    {
      header: "Tên",
      accessorKey: "title",
    },
    {
      header: "Nội dung",
      accessorKey: "content",
      cell: ({ row }) => (
        <div className="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap line-clamp-4">
          {row.original.content}
        </div>
      ),
    },
    {
      header: "Phân loại",
      accessorKey: "category",
    },
    {
      header: "Tác giả",
      accessorKey: "author.full_name",
    },
    {
      header: "Lượt xem",
      accessorKey: "views_count",
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            className="bg-white-100 text-blue-700 hover:bg-blue-700 hover:text-white-100"
            onClick={() => onUpdated(row.original)}
          >
            Edit
          </Button>
          <Button
            className="bg-white-100 text-red-500 hover:bg-red-500 hover:text-white-100"
            onClick={() => onDeleted(row.original.post_id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];
};
