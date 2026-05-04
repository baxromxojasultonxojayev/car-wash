import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Calendar,
  Car,
  Filter,
} from 'lucide-react';
import { Card, Select, Button, Table, Typography, Space, Row, Col } from 'antd';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const { Title, Text } = Typography;

const revenueData = [
  { name: 'Dush', revenue: 2400000 },
  { name: 'Sesh', revenue: 1398000 },
  { name: 'Chor', revenue: 9800000 },
  { name: 'Pay', revenue: 3908000 },
  { name: 'Jum', revenue: 4800000 },
  { name: 'Shan', revenue: 8800000 },
  { name: 'Yak', revenue: 6300000 },
];

const serviceData = [
  { name: 'Oddiy yuvish', count: 145 },
  { name: 'Premium yuvish', count: 89 },
  { name: 'VIP yuvish', count: 34 },
  { name: 'Salon tozalash', count: 56 },
];

const kioskData = [
  { name: 'Moyka #1', value: 35 },
  { name: 'Moyka #2', value: 28 },
  { name: 'Zapravka', value: 22 },
  { name: 'Auto Service', value: 15 },
];

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6'];

const transactionData = [
  { id: '1', date: '2024-02-09', kiosk: 'Premium Moyka #1', service: 'VIP yuvish', amount: 100000 },
  { id: '2', date: '2024-02-09', kiosk: 'Premium Moyka #1', service: 'Premium yuvish', amount: 50000 },
  { id: '3', date: '2024-02-09', kiosk: 'Express Zapravka', service: 'AI-95', amount: 280000 },
  { id: '4', date: '2024-02-08', kiosk: 'Premium Moyka #1', service: 'Oddiy yuvish', amount: 30000 },
  { id: '5', date: '2024-02-08', kiosk: 'Auto Service Pro', service: 'Yog\' almashtirish', amount: 150000 },
];

export default function StatisticsPage() {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState('week');
  const [kioskFilter, setKioskFilter] = useState('all');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('uz-UZ').format(value) + ' so\'m';
  };

  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
  const totalSessions = serviceData.reduce((sum, d) => sum + d.count, 0);

  const transactionColumns = [
    {
      title: t('date'),
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: t('kiosk'),
      dataIndex: 'kiosk',
      key: 'kiosk',
    },
    {
      title: t('service'),
      dataIndex: 'service',
      key: 'service',
    },
    {
      title: t('amount'),
      dataIndex: 'amount',
      key: 'amount',
      align: 'right' as const,
      render: (val: number) => <Text strong>{formatCurrency(val)}</Text>
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Title level={2} className="!mb-0 !text-foreground">{t('statistics')}</Title>
          <Text className="text-muted-foreground">{t('viewStatistics')}</Text>
        </div>
        <Space size="small">
          <Select 
            value={dateRange} 
            onChange={setDateRange} 
            className="w-[140px]"
            size="large"
            suffixIcon={<Calendar size={14} />}
            options={[
              { value: 'today', label: t('today') },
              { value: 'week', label: t('thisWeek') },
              { value: 'month', label: t('thisMonth') },
              { value: 'year', label: t('thisYear') },
            ]}
          />
          <Select 
            value={kioskFilter} 
            onChange={setKioskFilter} 
            className="w-[160px]"
            size="large"
            suffixIcon={<Filter size={14} />}
            options={[
              { value: 'all', label: t('allKiosks') },
              { value: '1', label: 'Premium Moyka #1' },
              { value: '2', label: 'Express Zapravka' },
              { value: '3', label: 'Auto Service Pro' },
            ]}
          />
        </Space>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={12} lg={6}>
          <Card bordered={false} className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20" styles={{ body: { padding: '20px' } }}>
            <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-2">{t('totalRevenue')}</Text>
            <Space align="center" className="mb-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <span className="text-xl font-bold">{formatCurrency(totalRevenue)}</span>
            </Space>
            <p className="text-xs text-green-500 mt-1 flex items-center gap-1 mb-0">
              <TrendingUp className="h-3 w-3" />
              +12.5% {t('fromLastWeek')}
            </p>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card bordered={false} className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20" styles={{ body: { padding: '20px' } }}>
            <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-2">{t('totalSessions')}</Text>
            <Space align="center" className="mb-2">
              <Car className="h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold">{totalSessions}</span>
            </Space>
            <p className="text-xs text-blue-500 mt-1 flex items-center gap-1 mb-0">
              <TrendingUp className="h-3 w-3" />
              +8.2% {t('fromLastWeek')}
            </p>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card bordered={false} className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20" styles={{ body: { padding: '20px' } }}>
            <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-2">{t('averageCheck')}</Text>
            <Space align="center">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <span className="text-xl font-bold">{formatCurrency(Math.round(totalRevenue / totalSessions))}</span>
            </Space>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card bordered={false} className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20" styles={{ body: { padding: '20px' } }}>
            <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-2">{t('activeKiosks')}</Text>
            <Space align="center">
              <BarChart3 className="h-5 w-5 text-orange-500" />
              <span className="text-2xl font-bold">4</span>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card bordered={false} title={t('weeklyRevenue')} className="bg-card border border-border/20 shadow-sm" styles={{ body: { padding: '20px' } }}>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} />
                  <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000000}M`} />
                  <ChartTooltip
                    formatter={(value: number | undefined) => formatCurrency(value ?? 0)}
                    contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card bordered={false} title={t('serviceDistribution')} className="bg-card border border-border/20 shadow-sm" styles={{ body: { padding: '20px' } }}>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serviceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} />
                  <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} />
                  <ChartTooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                  <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card bordered={false} title={t('kioskDistribution')} className="bg-card border border-border/20 shadow-sm h-full" styles={{ body: { padding: '20px' } }}>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={kioskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {kioskData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                    ))}
                  </Pie>
                  <ChartTooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <Space wrap justify="center" className="w-full mt-4">
              {kioskData.map((d, i) => (
                <Space key={d.name} size={4}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <Text className="text-muted-foreground text-sm">{d.name}</Text>
                </Space>
              ))}
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Card bordered={false} title={t('recentTransactions')} className="bg-card border border-border/20 shadow-sm overflow-hidden" styles={{ body: { padding: '0' } }}>
            <Table 
              dataSource={transactionData} 
              columns={transactionColumns} 
              pagination={false} 
              rowKey="id"
              className="ant-table-custom"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
