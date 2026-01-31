"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
} from "recharts"
import { Download, Filter } from "lucide-react"

interface Payment {
  id: string
  method: "rfid" | "cash" | "payme" | "click" | "uzum"
  amount: number
  paidAt: string
}

interface WashSession {
  id: string
  kioskName: string
  status: "pending" | "running" | "paused" | "finished"
  startedAt: string
  finishedAt?: string
  duration: number
  totalPaid: number
  payments: Payment[]
  createdAt: string
}

export default function ReportsPage() {
  const [dateFrom, setDateFrom] = useState("2024-02-01")
  const [dateTo, setDateTo] = useState("2024-02-29")

  const sessions: WashSession[] = [
    {
      id: "1",
      kioskName: "Kiosk Premium 1",
      status: "finished",
      startedAt: "2024-02-15 08:30",
      finishedAt: "2024-02-15 08:45",
      duration: 15,
      totalPaid: 25000,
      payments: [{ id: "p1", method: "rfid", amount: 25000, paidAt: "2024-02-15 08:45" }],
      createdAt: "2024-02-15",
    },
    {
      id: "2",
      kioskName: "Kiosk Standard 2",
      status: "finished",
      startedAt: "2024-02-15 09:00",
      finishedAt: "2024-02-15 09:20",
      duration: 20,
      totalPaid: 35000,
      payments: [{ id: "p2", method: "cash", amount: 35000, paidAt: "2024-02-15 09:20" }],
      createdAt: "2024-02-15",
    },
    {
      id: "3",
      kioskName: "Kiosk Premium 1",
      status: "finished",
      startedAt: "2024-02-15 10:00",
      finishedAt: "2024-02-15 10:18",
      duration: 18,
      totalPaid: 30000,
      payments: [{ id: "p3", method: "payme", amount: 30000, paidAt: "2024-02-15 10:18" }],
      createdAt: "2024-02-15",
    },
    {
      id: "4",
      kioskName: "Kiosk Standard 3",
      status: "finished",
      startedAt: "2024-02-16 07:30",
      finishedAt: "2024-02-16 08:00",
      duration: 30,
      totalPaid: 50000,
      payments: [{ id: "p4", method: "click", amount: 50000, paidAt: "2024-02-16 08:00" }],
      createdAt: "2024-02-16",
    },
    {
      id: "5",
      kioskName: "Kiosk Premium 1",
      status: "finished",
      startedAt: "2024-02-16 11:00",
      finishedAt: "2024-02-16 11:25",
      duration: 25,
      totalPaid: 40000,
      payments: [{ id: "p5", method: "uzum", amount: 40000, paidAt: "2024-02-16 11:25" }],
      createdAt: "2024-02-16",
    },
  ]

  const dailyData = [
    { date: "15-Feb", sessions: 3, revenue: 90000 },
    { date: "16-Feb", sessions: 2, revenue: 90000 },
    { date: "17-Feb", sessions: 4, revenue: 130000 },
    { date: "18-Feb", sessions: 3, revenue: 95000 },
    { date: "19-Feb", sessions: 5, revenue: 160000 },
    { date: "20-Feb", sessions: 2, revenue: 65000 },
    { date: "21-Feb", sessions: 6, revenue: 200000 },
  ]

  const paymentMethods = [
    { name: "RFID", value: 35, color: "#3b82f6" },
    { name: "Naqd", value: 25, color: "#1e40af" },
    { name: "Payme", value: 20, color: "#1e3a8a" },
    { name: "Click", value: 12, color: "#0c4a6e" },
    { name: "Uzum", value: 8, color: "#164e63" },
  ]

  const stats = {
    totalSessions: sessions.length,
    totalRevenue: sessions.reduce((sum, s) => sum + s.totalPaid, 0),
    avgSessionTime: Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length),
    avgRevenue: Math.round(sessions.reduce((sum, s) => sum + s.totalPaid, 0) / sessions.length),
  }

  const methodCounts = sessions.reduce(
    (acc, session) => {
      session.payments.forEach((payment) => {
        acc[payment.method] = (acc[payment.method] || 0) + payment.amount
      })
      return acc
    },
    {} as Record<string, number>,
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const methodLabels: Record<string, string> = {
    rfid: "RFID Karta",
    cash: "Naqd Pul",
    payme: "Payme",
    click: "Click",
    uzum: "Uzum",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Hisobotlar</h1>
          <p className="text-muted-foreground mt-1">Yuvish sessiyalari va to'lovlar</p>
        </div>
      </div>

      {/* Date Filter */}
      <Card className="bg-card border border-border/20 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-foreground mb-2">Boshlanish sanasi</label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-input text-foreground border-border/30"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-foreground mb-2">Tugash sanasi</label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-input text-foreground border-border/30"
            />
          </div>
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2">
            <Filter size={18} />
            Qo'llash
          </button>
          <button className="px-6 py-2 bg-sidebar hover:bg-sidebar/80 text-foreground rounded-lg transition-colors flex items-center gap-2">
            <Download size={18} />
            Yuklash
          </button>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border border-border/20 p-6">
          <p className="text-muted-foreground text-sm font-medium mb-2">Sessiyalar</p>
          <p className="text-2xl font-bold text-foreground">{stats.totalSessions}</p>
          <p className="text-xs text-muted-foreground mt-2">ta yuvish sessiyasi</p>
        </Card>
        <Card className="bg-card border border-border/20 p-6">
          <p className="text-muted-foreground text-sm font-medium mb-2">Umumiy Daromad</p>
          <p className="text-xl font-bold text-cyan-500 truncate">{formatCurrency(stats.totalRevenue)}</p>
          <p className="text-xs text-muted-foreground mt-2">so'mda</p>
        </Card>
        <Card className="bg-card border border-border/20 p-6">
          <p className="text-muted-foreground text-sm font-medium mb-2">O'rtacha Vaqt</p>
          <p className="text-2xl font-bold text-foreground">{stats.avgSessionTime}</p>
          <p className="text-xs text-muted-foreground mt-2">daqiqa</p>
        </Card>
        <Card className="bg-card border border-border/20 p-6">
          <p className="text-muted-foreground text-sm font-medium mb-2">O'rtacha Daromad</p>
          <p className="text-xl font-bold text-green-500 truncate">{formatCurrency(stats.avgRevenue)}</p>
          <p className="text-xs text-muted-foreground mt-2">sessiyaga</p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Revenue */}
        <Card className="lg:col-span-2 bg-card border border-border/20 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Kunlik Daromad</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis dataKey="date" stroke="rgba(148, 163, 184, 0.5)" />
              <YAxis stroke="rgba(148, 163, 184, 0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#e2e8f0" }}
              />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Payment Methods */}
        <Card className="bg-card border border-border/20 p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">To'lov Usullari</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentMethods}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {paymentMethods.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Daily Sessions */}
      <Card className="bg-card border border-border/20 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Kunlik Sessiyalar</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis dataKey="date" stroke="rgba(148, 163, 184, 0.5)" />
            <YAxis stroke="rgba(148, 163, 184, 0.5)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(148, 163, 184, 0.2)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#e2e8f0" }}
            />
            <Line
              type="monotone"
              dataKey="sessions"
              stroke="#06b6d4"
              dot={{ fill: "#06b6d4", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Payment Methods Breakdown */}
      <Card className="bg-card border border-border/20 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">To'lov Usullari bo'yicha</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(methodCounts).map(([method, amount]) => (
            <div key={method} className="p-4 bg-sidebar/20 rounded-lg border border-border/20">
              <p className="text-xs text-muted-foreground mb-2">{methodLabels[method]}</p>
              <p className="text-lg font-bold text-cyan-500">{formatCurrency(amount)}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Sessions Table */}
      <Card className="bg-card border border-border/20 overflow-hidden">
        <div className="p-6 border-b border-border/20">
          <h3 className="text-lg font-semibold text-foreground">Sessiyalar Ro'yxati</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border/20 bg-sidebar/20">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Kiosk</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Vaqt</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Davomiyligi</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">To'lov Usuli</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Summa</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id} className="border-b border-border/20 hover:bg-sidebar/10 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{session.kioskName}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{session.startedAt}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{session.duration} daqiqa</td>
                  <td className="px-6 py-4 text-sm">
                    {session.payments.map((p) => (
                      <span
                        key={p.id}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-500/10 text-blue-500"
                      >
                        {methodLabels[p.method]}
                      </span>
                    ))}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-cyan-500">
                    {formatCurrency(session.totalPaid)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
