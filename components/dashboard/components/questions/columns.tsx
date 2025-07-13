import { StatusTypeEnums } from "@/app/(dashboard)/consultant/dashboard/questions/view/ManageQuestionsClient";
import { getQuestionStatusBadgeVariant } from "@/components/dashboard/components/appointment/helpers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuestionsGetList } from "@/types/question/QuestionTypes";
import { ColumnDef } from "@tanstack/react-table";
import { MessageSquare } from "lucide-react";

interface QuestionssColumnsProps {
  onAnswer: (question: QuestionsGetList) => void;
  onView: (question: QuestionsGetList) => void;
  onDelete: (id: string) => void;
}

export const createQuestionColumns = ({
  onAnswer,
  onView,
  onDelete,
}: QuestionssColumnsProps): ColumnDef<QuestionsGetList>[] => {
  return [
    {
      accessorKey: "title",
      header: "Tiêu đề",
      cell: ({ row }) => (
        <div className="max-w-[200px]">
          <p className="font-medium truncate">{row.original.title}</p>
          <p className="text-sm text-muted-foreground truncate">
            {row.original.content}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Loại",
      cell: ({ row }) => (
        <Badge variant="secondary">{row.original.category}</Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.original.status;
        const variant =
          status === StatusTypeEnums.PENDING
            ? "destructive"
            : status === StatusTypeEnums.ANSWERED
            ? "default"
            : "secondary";

        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    {
      accessorKey: "user_full_name",
      header: "Người hỏi",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.user_full_name}</p>
          <p className="text-sm text-muted-foreground">
            {row.original.user_email}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "answer",
      header: "Câu trả lời",
      cell: ({ row }) => (
        <div className="max-w-[150px]">
          {row.original.answer ? (
            <p className="text-sm truncate">{row.original.answer}</p>
          ) : (
            <span className="text-muted-foreground">Chưa trả lời</span>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => {
        const question = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(question)}
            >
              Xem
            </Button>
            <Badge className={getQuestionStatusBadgeVariant(question.status)}>
              {question.status}
            </Badge>
            {question.status === StatusTypeEnums.PENDING && (
              <Button
                variant="default"
                size="sm"
                onClick={() => onAnswer(question)}
                className="flex items-center gap-1"
              >
                <MessageSquare className="h-3 w-3" />
                Trả lời
              </Button>
            )}
            {/* <Select
              value={question.status}
              onValueChange={(value) =>
                onUpdateStatus(question.question_id, value as StatusTypeEnums)
              }
            >
              <SelectTrigger className="w-[100px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={StatusTypeEnums.PENDING}>Pending</SelectItem>
                <SelectItem value={StatusTypeEnums.ANSWERED}>
                  Answered
                </SelectItem>
                <SelectItem value={StatusTypeEnums.CLOSED}>Closed</SelectItem>
              </SelectContent>
            </Select> */}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(question.question_id)}
            >
              Xóa
            </Button>
          </div>
        );
      },
    },
  ];
};
