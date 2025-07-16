"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getAppointmentStats,
  getUserStats,
  getRevenueStats,
  getServiceStats,
  getTestResultStats,
  getCycleStats,
  getQuestionStats,
  getCustomerServiceUsageStats,
} from "@/app/api/statistics/action";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  CalendarDays,
  Users,
  DollarSign,
  Repeat,
  FlaskConical,
  RefreshCw,
  HelpCircle,
  UserCheck,
} from "lucide-react";

// Helper để sinh màu gradient cho từng chart

const statCards = [
  {
    key: "appointments",
    title: "Tổng lịch hẹn",
    icon: <CalendarDays className="text-indigo-500" size={20} />,
    color: "from-indigo-100 to-indigo-50",
    bgIcon: "bg-indigo-200",
  },
  {
    key: "users",
    title: "Tổng người dùng",
    icon: <Users className="text-cyan-500" size={20} />,
    color: "from-cyan-100 to-cyan-50",
    bgIcon: "bg-cyan-200",
  },
  {
    key: "revenue",
    title: "Doanh thu",
    icon: <DollarSign className="text-green-500" size={20} />,
    color: "from-green-100 to-green-50",
    bgIcon: "bg-green-200",
  },
  {
    key: "services",
    title: "Sử dụng dịch vụ",
    icon: <Repeat className="text-fuchsia-500" size={20} />,
    color: "from-fuchsia-100 to-fuchsia-50",
    bgIcon: "bg-fuchsia-200",
  },
];

const chartStats: {
  key: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  chartType: "bar" | "area";
}[] = [
  {
    key: "testResults",
    title: "Thống kê xét nghiệm",
    icon: <FlaskConical className="text-blue-500" size={20} />,
    color: "#3b82f6",
    chartType: "bar", // BarChart
  },
  {
    key: "cycles",
    title: "Thống kê chu kỳ",
    icon: <RefreshCw className="text-fuchsia-500" size={20} />,
    color: "#a21caf",
    chartType: "bar", // BarChart
  },
  {
    key: "questions",
    title: "Thống kê câu hỏi",
    icon: <HelpCircle className="text-orange-500" size={20} />,
    color: "#f59e42",
    chartType: "area", // AreaChart
  },
  {
    key: "customerUsage",
    title: "Khách hàng dùng dịch vụ",
    icon: <UserCheck className="text-teal-500" size={20} />,
    color: "#14b8a6",
    chartType: "area", // AreaChart
  },
];

export default function Statistics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Record<string, number | undefined>>({});

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          appointments,
          users,
          revenue,
          services,
          testResults,
          cycles,
          questions,
          customerUsage,
        ] = await Promise.all([
          getAppointmentStats(),
          getUserStats(),
          getRevenueStats(),
          getServiceStats(),
          getTestResultStats(),
          getCycleStats(),
          getQuestionStats(),
          getCustomerServiceUsageStats(),
        ]);

        setData({
          appointments: appointments.total,
          users: users.total,
          revenue: Number(revenue.total),
          services: services.total,
          testResults: testResults.total,
          cycles: cycles.total,
          questions: questions.total,
          customerUsage: customerUsage.total,
        });
      } catch (error) {
        console.error("Lỗi khi tải thống kê:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 p-4 md:p-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <StatCard
            key={stat.key}
            title={stat.title}
            value={
              stat.key === "revenue"
                ? (data[stat.key]?.toLocaleString() || 0) + " ₫"
                : data[stat.key]?.toLocaleString() || 0
            }
            icon={stat.icon}
            color={stat.color}
            bgIcon={stat.bgIcon}
            loading={loading}
          />
        ))}
      </div>

      {/* Charts */}
    <div className="grid grid-cols-1 gap-6">
        {chartStats.map((stat) => (
          <StatChart
            key={stat.key}
            title={stat.title}
            icon={stat.icon}
            value={data[stat.key]?.toLocaleString() || 0}
            data={[{ name: stat.title, value: data[stat.key] ?? 0 }]}
            color={stat.color}
            chartType={stat.chartType}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
}

// Card style hiện đại với hiệu ứng hover, icon nổi bật
function StatCard({
  title,
  value,
  icon,
  color,
  bgIcon,
  loading,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgIcon: string;
  loading: boolean;
}) {
  return (
    <Card
      className={`
        relative overflow-hidden rounded-xl border-0
        bg-gradient-to-br ${color}
        shadow-lg hover:shadow-2xl transition-all duration-200 group
        min-h-[120px]
      `}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <CardDescription>Thống kê tổng</CardDescription>
        </div>
        <div
          className={`
            ${bgIcon} rounded-full p-2 flex items-center justify-center
            shadow-md group-hover:scale-110 transition-transform duration-150
          `}
        >
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-28 mt-2" />
        ) : (
          <span className="text-2xl font-extrabold tracking-tight mt-2 block text-gray-900">
            {value}
          </span>
        )}
      </CardContent>
    </Card>
  );
}

// Chart Card với icon, số tổng nổi bật, hỗ trợ hai loại chart
function StatChart({
  title,
  icon,
  value,
  data,
  color,
  chartType,
  loading,
}: {
  title: string;
  icon: React.ReactNode;
  value: string | number;
  data: { name: string; value: number }[];
  color: string;
  chartType: "bar" | "area";
  loading: boolean;
}) {
  return (
    <Card className="rounded-xl border-0 shadow-lg hover:shadow-2xl transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {icon}
            <span>{title}</span>
          </CardTitle>
          <CardDescription className="font-medium text-gray-500">
            Tổng: {value}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="h-[180px] flex items-end">
        {loading ? (
          <Skeleton className="h-28 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height="90%">
            {chartType === "bar" ? (
              <BarChart data={data} barCategoryGap={30}>
                <defs>
                  <linearGradient id={`barColor${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.95} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  fontSize={12}
                  fontWeight={500}
                  stroke="#4b5563"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#4b5563" }}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.04)" }}
                  contentStyle={{
                    borderRadius: 12,
                    minWidth: 80,
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                  labelStyle={{ fontWeight: 600, color: "#1f2937" }}
                />
                <Bar
                  dataKey="value"
                  fill={`url(#barColor${title})`}
                  radius={[8, 8, 0, 0]}
                  barSize={36}
                />
              </BarChart>
            ) : (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={`areaColor${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  fontSize={12}
                  fontWeight={500}
                  stroke="#4b5563"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#4b5563" }}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.04)" }}
                  contentStyle={{
                    borderRadius: 12,
                    minWidth: 80,
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                  labelStyle={{ fontWeight: 600, color: "#1f2937" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  fill={`url(#areaColor${title})`}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}