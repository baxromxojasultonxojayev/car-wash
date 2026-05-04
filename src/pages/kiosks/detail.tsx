import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Zap, DollarSign, Calendar, MapPin } from 'lucide-react';
import { Button, Card, Badge, Typography, Row, Col, Space } from 'antd';

const { Title, Text, Paragraph } = Typography;

export default function KioskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const kiosk = {
    id,
    name: 'Premium Moyka #1',
    type: 'moyka' as const,
    boxNumbers: '1-8',
    address: 'Toshkent, Chilonzor tumani',
    status: 'active' as const,
    todayRevenue: 2500000,
    monthRevenue: 45000000,
    createdAt: '2024-01-15',
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('uz-UZ').format(value) + ' so\'m';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          type="text" 
          icon={<ArrowLeft size={20} />} 
          onClick={() => navigate(-1)} 
          size="large"
          className="flex items-center justify-center"
        />
        <div>
          <Title level={2} className="!mb-0 !text-foreground">{kiosk.name}</Title>
          <Text className="text-muted-foreground">{t('kioskDetails')}</Text>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="bg-card border border-border/20 shadow-sm" styles={{ body: { padding: '20px' } }}>
            <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-3 flex items-center gap-2">
              <Zap size={14} />
              {t('status')}
            </Text>
            <Badge 
              status={kiosk.status === 'active' ? 'success' : 'default'} 
              text={kiosk.status === 'active' ? t('active') : t('inactive')} 
              className="font-medium"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="bg-card border border-border/20 shadow-sm" styles={{ body: { padding: '20px' } }}>
            <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-3 flex items-center gap-2">
              <DollarSign size={14} />
              {t('todayRevenue')}
            </Text>
            <Title level={4} className="!mb-0">{formatCurrency(kiosk.todayRevenue)}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="bg-card border border-border/20 shadow-sm" styles={{ body: { padding: '20px' } }}>
            <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-3 flex items-center gap-2">
              <DollarSign size={14} />
              {t('monthRevenue')}
            </Text>
            <Title level={4} className="!mb-0">{formatCurrency(kiosk.monthRevenue)}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="bg-card border border-border/20 shadow-sm" styles={{ body: { padding: '20px' } }}>
            <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider block mb-3 flex items-center gap-2">
              <Calendar size={14} />
              {t('createdAt')}
            </Text>
            <Title level={4} className="!mb-0">{kiosk.createdAt}</Title>
          </Card>
        </Col>
      </Row>

      <Card bordered={false} className="bg-card border border-border/20 shadow-sm" styles={{ body: { padding: '24px' } }}>
        <Space direction="vertical" size="middle" className="w-full">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <MapPin className="h-5 w-5 text-blue-500" />
            </div>
            <Title level={4} className="!mb-0">{t('address')}</Title>
          </div>
          <Paragraph className="text-muted-foreground text-lg mb-4">
            {kiosk.address}
          </Paragraph>
          {kiosk.boxNumbers && (
            <div className="pt-4 border-t border-border/10">
              <Space>
                <Text className="text-muted-foreground">{t('boxNumbers')}:</Text>
                <Tag className="rounded-full border-none px-4 bg-blue-500/10 text-blue-600 font-bold">
                  {kiosk.boxNumbers}
                </Tag>
              </Space>
            </div>
          )}
        </Space>
      </Card>
    </div>
  );
}
