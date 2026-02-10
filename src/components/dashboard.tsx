

import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Zap, Users, Building2, DollarSign, TrendingUp, TrendingDown, CreditCard, Activity } from "lucide-react";

const sessionData = [
  { name: "Mon", sessions: 120, revenue: 1200 },
  { name: "Tue", sessions: 132, revenue: 1400 },
  { name: "Wed", sessions: 101, revenue: 950 },
  { name: "Thu", sessions: 98, revenue: 980 },
  { name: "Fri", sessions: 199, revenue: 2210 },
  { name: "Sat", sessions: 200, revenue: 2290 },
  { name: "Sun", sessions: 145, revenue: 1890 },
];

const paymentData = [
  { name: "RFID", value: 40, color: "#3b82f6" },
  { name: "Cash", value: 30, color: "#8b5cf6" },
  { name: "Payme", value: 20, color: "#06b6d4" },
  { name: "Click", value: 10, color: "#10b981" },
];

export default function Dashboard() {
  const { t } = useTranslation();

  const stats = [
    {
      label: t("activeKiosks"),
      value: "24",
      change: "+12%",
      isPositive: true,
      icon: Zap,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-500/20 to-blue-600/10",
      iconBg: "bg-blue-500/20",
      textColor: "text-blue-500",
    },
    {
      label: t("totalUsers"),
      value: "1,234",
      change: "+8%",
      isPositive: true,
      icon: Users,
      gradient: "from-cyan-500 to-cyan-600",
      bgGradient: "from-cyan-500/20 to-cyan-600/10",
      iconBg: "bg-cyan-500/20",
      textColor: "text-cyan-500",
    },
    {
      label: t("companies"),
      value: "8",
      change: "+2",
      isPositive: true,
      icon: Building2,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-500/20 to-purple-600/10",
      iconBg: "bg-purple-500/20",
      textColor: "text-purple-500",
    },
    {
      label: t("todayRevenue"),
      value: "$4,280",
      change: "+23%",
      isPositive: true,
      icon: DollarSign,
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-500/20 to-emerald-600/10",
      iconBg: "bg-emerald-500/20",
      textColor: "text-emerald-500",
    },
  ];

  const additionalStats = [
    {
      label: t("activeCards"),
      value: "156",
      icon: CreditCard,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      label: t("totalSessions"),
      value: "995",
      icon: Activity,
      color: "text-pink-500",
      bg: "bg-pink-500/10",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className={`relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} border-0 p-3 sm:p-4 lg:p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background decoration */}
              <div className={`absolute -right-4 -top-4 w-16 sm:w-24 h-16 sm:h-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`} />
              
              <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="space-y-1 sm:space-y-2 order-2 sm:order-1">
                  <p className="text-muted-foreground text-xs sm:text-sm font-medium line-clamp-1">
                    {stat.label}
                  </p>
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                    {stat.value}
                  </p>
                  <div className={`flex items-center gap-1 text-xs sm:text-sm font-medium ${stat.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                    {stat.isPositive ? <TrendingUp size={12} className="sm:w-[14px] sm:h-[14px]" /> : <TrendingDown size={12} className="sm:w-[14px] sm:h-[14px]" />}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${stat.iconBg} transition-transform group-hover:scale-110 self-start order-1 sm:order-2`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.textColor}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {additionalStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="bg-card/50 backdrop-blur border border-border/30 p-3 sm:p-4 hover:bg-card/80 transition-colors">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`p-1.5 sm:p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-4 h-4 sm:w-[18px] sm:h-[18px] ${stat.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{stat.label}</p>
                  <p className="text-sm sm:text-lg font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
        
        {/* Weekly Progress Mini Card */}
        <Card className="bg-card/50 backdrop-blur border border-border/30 p-3 sm:p-4 col-span-2 hover:bg-card/80 transition-colors">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{t("weeklyRevenue")}</p>
              <p className="text-sm sm:text-lg font-bold text-foreground">$10,920</p>
            </div>
            <div className="flex-1 ml-3 sm:ml-4 h-6 sm:h-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sessionData}>
                  <defs>
                    <linearGradient id="miniGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    fill="url(#miniGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 bg-card/80 backdrop-blur border border-border/30 p-4 sm:p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-foreground">{t("weeklyRevenue")}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Daily revenue overview</p>
            </div>
            <div className="flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs sm:text-sm font-medium self-start sm:self-auto">
              <TrendingUp size={12} className="sm:w-[14px] sm:h-[14px]" />
              +18.2%
            </div>
          </div>
          <div className="h-[200px] sm:h-[250px] lg:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sessionData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border/30" />
                <XAxis dataKey="name" stroke="currentColor" className="text-muted-foreground" fontSize={10} tick={{ fontSize: 10 }} />
                <YAxis stroke="currentColor" className="text-muted-foreground" fontSize={10} tick={{ fontSize: 10 }} width={30} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    boxShadow: "0 10px 40px -10px rgba(0,0,0,0.3)",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "var(--foreground)", fontWeight: "bold" }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: "#3b82f6", strokeWidth: 2, fill: "var(--card)" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Payment Methods Pie Chart */}
        <Card className="bg-card/80 backdrop-blur border border-border/30 p-4 sm:p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-base sm:text-lg font-bold text-foreground mb-1 sm:mb-2">{t("paymentMethods")}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Distribution by method</p>
          <div className="h-[160px] sm:h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius="40%"
                  outerRadius="70%"
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mt-3 sm:mt-4">
            {paymentData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] sm:text-xs text-muted-foreground truncate">{item.name}</span>
                <span className="text-[10px] sm:text-xs font-medium text-foreground ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Sessions Bar Chart */}
      <Card className="bg-card/80 backdrop-blur border border-border/30 p-4 sm:p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start sm:items-center justify-between mb-4 sm:mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground">{t("washSessions")}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Daily session count</p>
          </div>
          <div className="text-right">
            <p className="text-xl sm:text-2xl font-bold text-foreground">995</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">total this week</p>
          </div>
        </div>
        <div className="h-[180px] sm:h-[220px] lg:h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sessionData} barCategoryGap="15%">
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border/30" vertical={false} />
              <XAxis dataKey="name" stroke="currentColor" className="text-muted-foreground" fontSize={10} tick={{ fontSize: 10 }} />
              <YAxis stroke="currentColor" className="text-muted-foreground" fontSize={10} tick={{ fontSize: 10 }} width={30} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  boxShadow: "0 10px 40px -10px rgba(0,0,0,0.3)",
                  fontSize: "12px",
                }}
                cursor={{ fill: "var(--muted)", opacity: 0.1 }}
              />
              <Bar 
                dataKey="sessions" 
                fill="url(#barGradient)" 
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
