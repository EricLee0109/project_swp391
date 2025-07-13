import { notFound } from "next/navigation";
import MaxWidthWrapper from "@/components/profile/MaxWidthWrapper";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAllConsultantProfiles } from "@/app/api/consultant/action";
import { ConsultantGetAll } from "@/types/user/CustomServiceType";
import {
  Star,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Clock,
  Award,
  Users,
  MessageSquare,
  Shield,
  Briefcase,
} from "lucide-react";
import QuestionSection from "@/components/question/QuestionsSection";

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { id: consultantId } = await params;

  // ✅ Gọi toàn bộ consultants
  const consultants = await getAllConsultantProfiles();

  // ✅ Tìm người có id phù hợp
  const consultant: ConsultantGetAll | undefined = consultants?.find(
    (c) => c.consultant.consultant_id === consultantId
  );

  if (!consultant) return notFound();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8">
      <MaxWidthWrapper>
        <div className="space-y-8">
          {/* Header Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white shadow-2xl">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                    <AvatarImage
                      src={consultant?.image || "/white-placeholder.png"}
                    />
                    <AvatarFallback className="bg-white text-gray-800 text-2xl font-bold">
                      {consultant?.full_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-4xl font-bold mb-2">
                      {consultant?.full_name}
                    </h1>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="secondary"
                        className="bg-white/20 text-white border-white/30"
                      >
                        <Briefcase className="w-4 h-4 mr-1" />
                        {consultant.consultant.specialization}
                      </Badge>
                      {consultant.consultant.is_verified && (
                        <Badge
                          variant="secondary"
                          className="bg-green-500/20 text-green-100 border-green-300/30"
                        >
                          <Shield className="w-4 h-4 mr-1" />
                          Đã xác minh
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">
                      {consultant.consultant.average_rating}/5
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>200+ tư vấn</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>{consultant.consultant.experience}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>Chuyên gia</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                  <Image
                    src={consultant?.image || "/white-placeholder.png"}
                    alt={`Ảnh của ${consultant.full_name}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl flex items-center space-x-2">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                    <span>Giới thiệu</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    Tôi là một chuyên gia tư vấn với nhiều năm kinh nghiệm trong
                    lĩnh vực {consultant.consultant.specialization}. Tôi cam kết
                    mang đến cho bạn những lời khuyên chuyên nghiệp và giải pháp
                    tối ưu nhất cho vấn đề của bạn. Với phương pháp tiếp cận
                    nhân văn và khoa học, tôi sẵn sàng đồng hành cùng bạn trên
                    hành trình tìm kiếm giải pháp.
                  </p>
                </CardContent>
              </Card>

              {/* Professional Info */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl flex items-center space-x-2">
                    <Award className="w-6 h-6 text-purple-600" />
                    <span>Thông tin chuyên môn</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-800">
                        Trình độ học vấn
                      </h4>
                      <p className="text-gray-600">
                        {consultant.consultant.qualifications}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-800">
                        Kinh nghiệm
                      </h4>
                      <p className="text-gray-600">
                        {consultant.consultant.experience}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800">Chuyên môn</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {consultant.consultant.specialization}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Tư vấn cá nhân
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-purple-50 text-purple-700 border-purple-200"
                      >
                        Hỗ trợ tâm lý
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Question Section */}
              <QuestionSection
                consultantId={consultantId}
                consultantName={consultant.full_name}
                specialization={consultant.consultant.specialization}
              />
            </div>

            {/* Right Column - Actions & Contact */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Đặt lịch tư vấn</CardTitle>
                  <CardDescription>
                    Bắt đầu hành trình tư vấn cùng chuyên gia
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
                    <Calendar className="w-4 h-4 mr-2" />
                    Đặt lịch ngay
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-2 border-blue-200 text-blue-600 hover:bg-blue-50 py-3 rounded-lg transition-all duration-200"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Nhắn tin trực tiếp
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Thông tin liên hệ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">{consultant.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">
                      {consultant.phone_number}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">{consultant.address}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Rating & Reviews */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Đánh giá</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-yellow-500">
                      {consultant.consultant.average_rating}
                    </div>
                    <div className="flex justify-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(consultant.consultant.average_rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">
                      Dựa trên 150+ đánh giá(demo)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </main>
  );
}
