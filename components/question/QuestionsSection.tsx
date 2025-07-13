"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Send,
  Upload,
  X,
  HelpCircle,
  Star,
  User,
} from "lucide-react";
import { notify } from "@/lib/toastNotify";
import { QuestionFormData } from "@/types/question/QuestionTypes";

interface QuestionSectionProps {
  consultantId: string;
  consultantName: string;
  specialization: string;
}

const categories = [
  { value: "STI", label: "Bệnh lây truyền qua đường tình dục" },
  { value: "Fertility", label: "Sinh sản và hiếm muộn" },
  { value: "General", label: "Tư vấn chung" },
  { value: "Mental", label: "Sức khỏe tinh thần" },
  { value: "Nutrition", label: "Dinh dưỡng" },
  { value: "Pregnancy", label: "Thai kỳ và sinh nở" },
  { value: "General Medicine", label: "Khám tổng quát" },
];

// Mock previous questions for demonstration
const mockQuestions = [
  {
    id: 1,
    title: "Tôi có nên lo lắng về triệu chứng này không?",
    content: "Gần đây tôi có một số triệu chứng khó chịu...",
    category: "General",
    createdAt: "2 ngày trước",
    status: "answered",
  },
  {
    id: 2,
    title: "Chế độ ăn uống như thế nào là tốt nhất?",
    content: "Tôi muốn cải thiện chế độ dinh dưỡng...",
    category: "Nutrition",
    createdAt: "1 tuần trước",
    status: "pending",
  },
];

export default function QuestionSection({
  consultantId,
  consultantName,
  specialization,
}: QuestionSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<QuestionFormData>({
    title: "",
    content: "",
    image: null,
    consultant_id: consultantId,
    category: specialization ?? "",
  });

  const handleInputChange = (field: keyof QuestionFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        notify("error", "File ảnh phải dưới 5mb");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.content.trim() ||
      !formData.category
    ) {
      notify("error", "Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for multipart/form-data
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("content", formData.content);
      submitData.append("consultant_id", formData.consultant_id);
      submitData.append("category", specialization ?? formData.category);

      if (formData.image) {
        submitData.append("image", formData.image);
      }
      console.log(formData, "formdata");
      // Replace with your actual API endpoint
      const response = await fetch("/api/questions", {
        method: "POST",
        body: submitData,
      });

      if (response.ok) {
        notify("success", "Câu hỏi của bạn đã được gửi thành công!");
        // return;

        // Reset form
        setFormData({
          title: "",
          content: "",
          image: null,
          consultant_id: consultantId,
          category: "",
        });
        setIsDialogOpen(false);
      } else {
        throw new Error("Failed to submit question");
      }
    } catch {
      notify("error", "Không thể gửi câu hỏi. Bạn có thể chưa đăng nhập!");
      //   redirect("/login");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl flex items-center space-x-2">
          <HelpCircle className="w-6 h-6 text-green-600" />
          <span>Đặt câu hỏi cho chuyên gia</span>
        </CardTitle>
        <CardDescription>
          Hãy đặt câu hỏi để nhận được lời khuyên chuyên môn từ {consultantName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Ask Question Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
                <MessageSquare className="w-4 h-4 mr-2" />
                Đặt câu hỏi ngay
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  <span>Đặt câu hỏi cho {consultantName}</span>
                </DialogTitle>
                <DialogDescription>
                  Chuyên gia về {specialization} sẽ trả lời câu hỏi của bạn
                  trong thời gian sớm nhất.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề câu hỏi *</Label>
                  <Input
                    id="title"
                    placeholder="Nhập tiêu đề ngắn gọn cho câu hỏi của bạn..."
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                {/* if have specialization yet, does not to select */}
                {!specialization ? (
                  <div className="space-y-2">
                    <Label htmlFor="category">Danh mục câu hỏi *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleInputChange("category", value)
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục phù hợp" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {categories.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2 space-x-2">
                    <Label htmlFor="category">Danh mục câu hỏi *</Label>
                    <Badge variant={"secondary"}>{specialization}</Badge>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="content">Nội dung câu hỏi *</Label>
                  <Textarea
                    id="content"
                    placeholder="Mô tả chi tiết câu hỏi của bạn. Càng chi tiết, chuyên gia càng có thể tư vấn chính xác..."
                    value={formData.content}
                    onChange={(e) =>
                      handleInputChange("content", e.target.value)
                    }
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Hình ảnh đính kèm (tùy chọn)</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("image")?.click()}
                      className="flex items-center space-x-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Chọn ảnh</span>
                    </Button>
                    {formData.image && (
                      <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded">
                        <span className="text-sm text-gray-700">
                          {formData.image.name}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeImage}
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Hỗ trợ: JPEG, PNG. Tối đa 5MB
                  </p>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Gửi câu hỏi
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Previous Questions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Câu hỏi gần đây
            </h3>
            {mockQuestions.map((question) => (
              <div
                key={question.id}
                className="border rounded-lg p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <h4 className="font-medium text-gray-800">
                        {question.title}
                      </h4>
                      <Badge
                        variant={
                          question.status === "answered"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {question.status === "answered"
                          ? "Đã trả lời"
                          : "Chờ trả lời"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {question.content}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Danh mục: {question.category}</span>
                      <span>{question.createdAt}</span>
                    </div>
                  </div>
                  {question.status === "answered" && (
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs">4.8</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
