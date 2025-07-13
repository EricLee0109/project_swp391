"use client";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/dashboard/header";
import { Skeleton } from "@/components/ui/skeleton";
import { notify } from "@/lib/toastNotify";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, RefreshCw } from "lucide-react";
import { createQuestionColumns } from "@/components/dashboard/components/questions/columns";
import Image from "next/image";
import { QuestionsGetList } from "@/types/question/QuestionTypes";

export enum StatusTypeEnums {
  PENDING = "Pending",
  ANSWERED = "Answered",
  CLOSED = "Closed",
}

export default function ManageQuestionsClient() {
  const [questions, setQuestions] = useState<QuestionsGetList[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<
    QuestionsGetList[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Answer Dialog states
  const [answerDialogOpen, setAnswerDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] =
    useState<QuestionsGetList | null>(null);
  const [answerText, setAnswerText] = useState<string>("");
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Get unique categories for filter
  const categories = [...new Set(questions.map((q) => q.category))];

  // Fetch questions
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch("/api/questions");
        const apiRes = await res.json();

        if (res.ok) {
          setQuestions(apiRes.questions || []);
          setFilteredQuestions(apiRes.questions || []);
        } else {
          setError(apiRes?.error || "Không thể tải danh sách câu hỏi.");
          notify("error", apiRes?.error || "Không thể tải danh sách câu hỏi.");
        }
      } catch {
        setError("Lỗi mạng. Vui lòng thử lại.");
        notify("error", "Lỗi mạng. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...questions];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (q) =>
          q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.user_full_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((q) => q.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((q) => q.category === categoryFilter);
    }

    setFilteredQuestions(filtered);
  }, [questions, searchQuery, statusFilter, categoryFilter]);

  // Handle question deletion
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/questions/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        // body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Xóa câu hỏi thất bại");

      setQuestions((prev) => prev.filter((q) => q.question_id !== id));
      notify("success", "Đã xóa câu hỏi");
    } catch {
      notify("error", "Không thể xóa câu hỏi");
    }
  };

  // Handle status update
  // const handleUpdateStatus = async (id: string, status: StatusTypeEnums) => {
  //   setIsUpdating(true);
  //   try {
  //     const res = await fetch("/api/questions", {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ question_id: id, status }),
  //     });

  //     if (!res.ok) throw new Error("Cập nhật trạng thái thất bại");

  //     setQuestions((prev) =>
  //       prev.map((q) => (q.question_id === id ? { ...q, status } : q))
  //     );
  //     notify("success", "Đã cập nhật trạng thái");
  //   } catch {
  //     notify("error", "Không thể cập nhật trạng thái");
  //   } finally {
  //     setIsUpdating(false);
  //   }
  // };

  // Handle answer question - opens dialog
  const handleAnswer = (question: QuestionsGetList) => {
    setSelectedQuestion(question);
    setAnswerText(question.answer || "");
    setAnswerDialogOpen(true);
  };

  // Handle answer submission
  const handleSubmitAnswer = async () => {
    if (!selectedQuestion || !answerText.trim()) {
      notify("error", "Vui lòng nhập câu trả lời");
      return;
    }

    setIsSubmittingAnswer(true);
    try {
      const res = await fetch(
        `/api/questions/${selectedQuestion.question_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // question_id: selectedQuestion.question_id,
            answer: answerText.trim(),
          }),
        }
      );

      if (!res.ok) throw new Error("Trả lời câu hỏi thất bại!");

      // Update the question in local state
      setQuestions((prev) =>
        prev.map((q) =>
          q.question_id === selectedQuestion.question_id
            ? {
                ...q,
                answer: answerText.trim(),
                status: StatusTypeEnums.ANSWERED,
              }
            : q
        )
      );

      setAnswerDialogOpen(false);
      setSelectedQuestion(null);
      setAnswerText("");
      notify("success", "Gửi câu trả lời thành công");
    } catch {
      notify("error", "Không thể gửi câu trả lời");
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // Handle close answer dialog
  const handleCloseAnswerDialog = () => {
    setAnswerDialogOpen(false);
    setSelectedQuestion(null);
    setAnswerText("");
  };

  // Handle view question (placeholder - implement dialog)
  const handleView = (question: QuestionsGetList) => {
    // Implement view dialog
    console.log("View question:", question);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCategoryFilter("all");
  };

  // Statistics
  const stats = {
    total: questions.length,
    pending: questions.filter((q) => q.status === StatusTypeEnums.PENDING)
      .length,
    answered: questions.filter((q) => q.status === StatusTypeEnums.ANSWERED)
      .length,
    closed: questions.filter((q) => q.status === StatusTypeEnums.CLOSED).length,
  };

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
        title="Quản lý câu hỏi"
        href="/dashboard/questions/view"
        currentPage="Theo dõi câu hỏi"
      />

      <div className="container mx-auto p-6">
        <div className="ml-4">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Theo dõi câu hỏi
            </h1>
            <p className="text-muted-foreground">
              Được giám sát bởi - Quản trị viên
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-sm text-muted-foreground">Tổng câu hỏi</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-destructive">
                  {stats.pending}
                </div>
                <p className="text-sm text-muted-foreground">Đang chờ</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {stats.answered}
                </div>
                <p className="text-sm text-muted-foreground">Đã trả lời</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-gray-600">
                  {stats.closed}
                </div>
                <p className="text-sm text-muted-foreground">Đã đóng</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm câu hỏi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value={StatusTypeEnums.PENDING}>
                      Pending
                    </SelectItem>
                    <SelectItem value={StatusTypeEnums.ANSWERED}>
                      Answered
                    </SelectItem>
                    <SelectItem value={StatusTypeEnums.CLOSED}>
                      Closed
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={resetFilters}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Đặt lại
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Questions Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                Danh sách câu hỏi ({filteredQuestions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={createQuestionColumns({
                  onAnswer: handleAnswer,
                  onView: handleView,
                  onDelete: handleDelete,
                })}
                data={filteredQuestions}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Answer Dialog */}
      <Dialog open={answerDialogOpen} onOpenChange={setAnswerDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Trả lời câu hỏi</DialogTitle>
          </DialogHeader>

          {selectedQuestion && (
            <div className="space-y-4">
              {/* Question Details */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Câu hỏi từ:</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">
                    {selectedQuestion.user_full_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedQuestion.user_email}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Tiêu đề:</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium">{selectedQuestion.title}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Nội dung câu hỏi:</Label>
                <div className="p-3 bg-muted rounded-lg max-h-32 overflow-y-auto">
                  <p>{selectedQuestion.content}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">Danh mục:</Label>
                  <Badge variant="secondary">{selectedQuestion.category}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">Trạng thái:</Label>
                  <Badge
                    variant={
                      selectedQuestion.status === StatusTypeEnums.PENDING
                        ? "destructive"
                        : selectedQuestion.status === StatusTypeEnums.ANSWERED
                        ? "default"
                        : "secondary"
                    }
                  >
                    {selectedQuestion.status}
                  </Badge>
                </div>
              </div>

              {/* Image if exists */}
              {selectedQuestion.image_url && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Hình ảnh đính kèm:
                  </Label>
                  <Image
                    width={300}
                    height={300}
                    src={selectedQuestion.image_url}
                    alt="Question attachment"
                    className="max-w-full h-auto rounded-lg border"
                  />
                </div>
              )}

              {/* Answer Input */}
              <div className="space-y-2">
                <Label htmlFor="answer" className="text-sm font-medium">
                  Câu trả lời của bạn: <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="answer"
                  placeholder="Nhập câu trả lời chi tiết cho câu hỏi này..."
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  className="min-h-[120px] resize-none"
                  disabled={isSubmittingAnswer}
                />
                <p className="text-xs text-muted-foreground">
                  Ký tự: {answerText.length}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseAnswerDialog}
              disabled={isSubmittingAnswer}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmitAnswer}
              disabled={isSubmittingAnswer || !answerText.trim()}
            >
              {isSubmittingAnswer ? "Đang gửi..." : "Gửi câu trả lời"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
