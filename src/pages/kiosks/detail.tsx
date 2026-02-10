import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Zap, DollarSign, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{kiosk.name}</h1>
          <p className="text-muted-foreground text-sm">{t('kioskDetails')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4" />
              {t('status')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={kiosk.status === 'active' ? 'default' : 'secondary'}>
              {kiosk.status === 'active' ? t('active') : t('inactive')}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              {t('todayRevenue')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xl font-bold">{formatCurrency(kiosk.todayRevenue)}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              {t('monthRevenue')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xl font-bold">{formatCurrency(kiosk.monthRevenue)}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {t('createdAt')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-lg font-medium">{kiosk.createdAt}</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {t('address')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{kiosk.address}</p>
          {kiosk.boxNumbers && (
            <p className="mt-2">
              <span className="text-muted-foreground">{t('boxNumbers')}: </span>
              <Badge variant="outline">{kiosk.boxNumbers}</Badge>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
