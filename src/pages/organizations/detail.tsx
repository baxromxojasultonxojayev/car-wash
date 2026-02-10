import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Building2, Zap, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function OrganizationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Mock data
  const organization = {
    id,
    name: 'Premium Car Wash',
    description: 'Toshkentdagi eng yaxshi avtomoyka xizmati',
    kiosksCount: 12,
    usersCount: 25,
    status: 'active' as const,
    createdAt: '2024-01-15',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{organization.name}</h1>
          <p className="text-muted-foreground text-sm">{t('organizationDetails')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {t('status')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={organization.status === 'active' ? 'default' : 'secondary'}>
              {organization.status === 'active' ? t('active') : t('inactive')}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4" />
              {t('kiosks')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{organization.kiosksCount}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('users')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{organization.usersCount}</span>
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
            <span className="text-lg font-medium">{organization.createdAt}</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('description')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{organization.description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
