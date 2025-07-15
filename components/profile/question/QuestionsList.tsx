"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MessageCircle, User, Tag, CheckCircle, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { QuestionsGetListToCustomer } from "@/types/question/QuestionTypes";

export default function QuestionsList() {
  const [questions, setQuestions] = useState<QuestionsGetListToCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/questions/list/my");
        if (!res.ok) throw new Error("Lỗi khi fetch questions");
        const data = await res.json();
        setQuestions(data.questions);
        console.log("Questions data:", data);
      } catch (err) {
        console.error("Lỗi:", err);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) {
    return (
      <div className="py-5 space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-6 w-1/3 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="py-5">
        <Card className="p-6">
          <p className="text-center text-muted-foreground">
            Không có câu hỏi nào được tìm thấy.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-5">
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Danh sách câu hỏi
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Tổng cộng {questions.length} câu hỏi
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.question_id}>
              <QuestionCard question={question} />
              {index < questions.length - 1 && <Separator className="mt-6" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function QuestionCard({ question }: { question: QuestionsGetListToCustomer }) {
  const getStatusBadge = (status: string) => {
    if (status === "Answered") {
      return (
        <Badge
          variant="default"
          className="bg-green-100 text-green-800 hover:bg-green-200"
        >
          <CheckCircle className="w-3 h-3 mr-1" />
          Đã trả lời
        </Badge>
      );
    }
    return (
      <Badge
        variant="secondary"
        className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      >
        <Clock className="w-3 h-3 mr-1" />
        Đang chờ
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">{question.title}</h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {question.user_full_name}
            </div>
            <div className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              {question.category}
            </div>
          </div>
        </div>
        <div className="ml-4">{getStatusBadge(question.status)}</div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Nội dung câu hỏi:
          </p>
          <p className="text-sm leading-relaxed">{question.content}</p>
        </div>

        {/* Image if exists */}
        {question.image_url && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Hình ảnh đính kèm:
            </p>
            <Image
              src={question.image_url}
              alt="Question attachment"
              width={200}
              height={150}
              className="rounded-lg object-cover border"
            />
          </div>
        )}

        {/* Answer */}
        {question.status === "Answered" && question.answer && (
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-medium">
                Trả lời bởi: {question.consultant_name}
              </p>
            </div>
            <p className="text-sm leading-relaxed">{question.answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
