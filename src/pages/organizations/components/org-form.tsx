import { useTranslation } from "react-i18next";
import { 
  Form, 
  Input, 
  InputNumber, 
  DatePicker, 
  Select, 
  Switch, 
  Button, 
  Row, 
  Col, 
  Typography, 
  Divider, 
  Space, 
  TimePicker,
  Card,
  Tooltip
} from "antd";
import {
    Building2,
    FileText,
    Hash,
    Percent,
    Calendar,
    MapPin,
    Plus,
    Trash2,
    Clock,
} from "lucide-react";
import type { OrgFormData, OrgFormProps, Branch, Schedule } from "../type";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const WEEKDAYS = [
    { key: 1, uz: "Dushanba", ru: "Понедельник", en: "Monday" },
    { key: 2, uz: "Seshanba", ru: "Вторник", en: "Tuesday" },
    { key: 3, uz: "Chorshanba", ru: "Среда", en: "Wednesday" },
    { key: 4, uz: "Payshanba", ru: "Четверг", en: "Thursday" },
    { key: 5, uz: "Juma", ru: "Пятница", en: "Friday" },
    { key: 6, uz: "Shanba", ru: "Суббота", en: "Saturday" },
    { key: 7, uz: "Yakshanba", ru: "Воскресенье", en: "Sunday" },
];

function createDefaultSchedule(): Schedule[] {
    return WEEKDAYS.map((d) => ({
        weekday: d.key,
        is_closed: false,
        opens_at: "09:00:00",
        closes_at: "21:00:00",
    }));
}

const DEFAULT_BRANCH: Branch = {
    name: "",
    type: "car_wash",
    address: "",
    lat: 0,
    lon: 0,
    schedule: createDefaultSchedule(),
};

export default function OrgForm({ organization, onSubmit, onCancel, loading }: OrgFormProps) {
    const { t, i18n } = useTranslation();
    const lang = i18n.language as "uz" | "ru" | "en";
    const [form] = Form.useForm();

    const initialValues = {
        display_name: organization?.display_name || "",
        legal_name: organization?.legal_name || "",
        tax_id: organization?.tax_id || "",
        default_take_rate: organization?.default_take_rate ?? 1,
        status: organization?.status === "active",
        starts_at: organization?.starts_at ? dayjs(organization.starts_at) : dayjs(),
        expires_at: organization?.expires_at ? dayjs(organization.expires_at) : null,
        branches: organization?.branches?.length
            ? organization.branches.map((b) => ({
                ...b,
                schedule: b.schedule?.length === 7 ? b.schedule.map(s => ({
                  ...s,
                  timeRange: s.is_closed ? null : [dayjs(s.opens_at, "HH:mm:ss"), dayjs(s.closes_at, "HH:mm:ss")]
                })) : createDefaultSchedule().map(s => ({
                  ...s,
                  timeRange: [dayjs(s.opens_at, "HH:mm:ss"), dayjs(s.closes_at, "HH:mm:ss")]
                })),
            }))
            : [{ ...DEFAULT_BRANCH, schedule: createDefaultSchedule().map(s => ({
                ...s,
                timeRange: [dayjs(s.opens_at, "HH:mm:ss"), dayjs(s.closes_at, "HH:mm:ss")]
              })) }],
    };

    const handleSubmit = async (values: any) => {
        const payload: OrgFormData = {
            ...values,
            status: values.status ? "active" : "inactive",
            starts_at: values.starts_at.toISOString(),
            expires_at: values.expires_at ? values.expires_at.toISOString() : null,
            branches: values.branches.map((b: any) => ({
                ...b,
                schedule: b.schedule.map((s: any) => ({
                    weekday: s.weekday,
                    is_closed: s.is_closed,
                    opens_at: s.is_closed || !s.timeRange ? null : s.timeRange[0].format("HH:mm:ss"),
                    closes_at: s.is_closed || !s.timeRange ? null : s.timeRange[1].format("HH:mm:ss"),
                })),
            })),
        };
        await onSubmit(payload);
    };

    const getDayName = (dayKey: number) => {
        const day = WEEKDAYS.find(w => w.key === dayKey);
        return lang === "ru" ? day?.ru : lang === "uz" ? day?.uz : day?.en;
    };

    return (
        <Form
            form={form}
            layout="vertical"
            initialValues={initialValues}
            onFinish={handleSubmit}
            className="space-y-4"
            requiredMark={false}
        >
            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="display_name"
                        label={<Space size={4}><Building2 size={14} className="text-blue-500" />{t("organizationName")}</Space>}
                        rules={[{ required: true, message: t("userNameRequired") }]}
                    >
                        <Input size="large" placeholder={t("enterOrgName")} />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="legal_name"
                        label={<Space size={4}><FileText size={14} className="text-emerald-500" />{t("legalName") || "Legal Name"}</Space>}
                        rules={[{ required: true, message: t("userNameRequired") }]}
                    >
                        <Input size="large" placeholder="OOO Example" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="tax_id"
                        label={<Space size={4}><Hash size={14} className="text-violet-500" />Tax ID (INN)</Space>}
                        rules={[{ required: true, message: t("userNameRequired") }]}
                    >
                        <Input size="large" placeholder="123456789" />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="default_take_rate"
                        label={<Space size={4}><Percent size={14} className="text-amber-500" />{t("defaultTakeRate") || "Take Rate (%)"}</Space>}
                    >
                        <InputNumber size="large" className="w-full" min={0} max={100} />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="starts_at"
                        label={<Space size={4}><Calendar size={14} className="text-cyan-500" />{t("startDate")}</Space>}
                        rules={[{ required: true }]}
                    >
                        <DatePicker showTime size="large" className="w-full" />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="expires_at"
                        label={<Space size={4}><Calendar size={14} className="text-rose-500" />{t("endDate")}</Space>}
                    >
                        <DatePicker showTime size="large" className="w-full" />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                name="status"
                valuePropName="checked"
                className="mb-0"
            >
                <Card bordered={false} className="bg-card border border-border/20" styles={{ body: { padding: '12px 16px' } }}>
                    <div className="flex items-center justify-between">
                        <Space>
                          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                            <Building2 size={18} />
                          </div>
                          <Text strong>{t("status")}</Text>
                        </Space>
                        <Space>
                          <Text type="secondary">{form.getFieldValue("status") ? t("active") : t("inactive")}</Text>
                          <Switch />
                        </Space>
                    </div>
                </Card>
            </Form.Item>

            <Divider orientation="left" className="!my-6">
                <Space size={4}>
                    <MapPin size={16} className="text-pink-500" />
                    {t("branches") || "Branches"}
                </Space>
            </Divider>

            <Form.List name="branches">
                {(fields, { add, remove }) => (
                    <div className="space-y-6">
                        {fields.map(({ key, name, ...restField }) => (
                            <Card 
                                key={key} 
                                bordered={false} 
                                className="bg-card border border-border/20 shadow-sm overflow-hidden"
                                styles={{ body: { padding: '20px' } }}
                                title={
                                    <Space>
                                        <Text strong className="uppercase tracking-wider text-xs">{t("branches") || "Branch"} #{name + 1}</Text>
                                    </Space>
                                }
                                extra={
                                    fields.length > 1 && (
                                        <Button 
                                            type="text" 
                                            danger 
                                            icon={<Trash2 size={16} />} 
                                            onClick={() => remove(name)} 
                                        />
                                    )
                                }
                            >
                                <Row gutter={12}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'name']}
                                            rules={[{ required: true, message: t("name") }]}
                                        >
                                            <Input placeholder={t("name")} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'address']}
                                            rules={[{ required: true, message: t("address") }]}
                                        >
                                            <Input placeholder={t("address")} />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row gutter={12}>
                                    <Col xs={24} sm={8}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'type']}
                                        >
                                            <Select>
                                                <Select.Option value="car_wash">Car Wash</Select.Option>
                                                <Select.Option value="gas_station">Gas Station</Select.Option>
                                                <Select.Option value="auto_service">Auto Service</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12} sm={8}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'lat']}
                                        >
                                            <InputNumber placeholder="Lat" className="w-full" step="any" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12} sm={8}>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'lon']}
                                        >
                                            <InputNumber placeholder="Lon" className="w-full" step="any" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <div className="mt-4">
                                    <Text type="secondary" size="small" className="flex items-center gap-2 mb-3">
                                        <Clock size={14} />
                                        {t("schedule") || "Schedule"}
                                    </Text>
                                    <div className="rounded-xl border border-border/10 overflow-hidden bg-background/30">
                                        <Form.List name={[name, 'schedule']}>
                                            {(dayFields) => (
                                                <>
                                                    {dayFields.map(({ key: dKey, name: dName, ...dRestField }) => {
                                                      const dayValue = form.getFieldValue(['branches', name, 'schedule', dName]);
                                                      return (
                                                        <div key={dKey} className={`flex items-center justify-between p-3 ${dName < 6 ? 'border-b border-border/10' : ''}`}>
                                                            <div className="flex items-center gap-4 flex-1">
                                                                <Text strong className="w-24 text-xs">{getDayName(dayValue?.weekday)}</Text>
                                                                <Form.Item
                                                                    {...dRestField}
                                                                    name={[dName, 'is_closed']}
                                                                    valuePropName="checked"
                                                                    className="mb-0"
                                                                >
                                                                    <Switch 
                                                                        checkedChildren={t("closed") || "Closed"} 
                                                                        unCheckedChildren={t("open") || "Open"}
                                                                        className="bg-red-500"
                                                                    />
                                                                </Form.Item>
                                                                <Form.Item
                                                                    {...dRestField}
                                                                    noStyle
                                                                    shouldUpdate={(prev, curr) => 
                                                                      prev.branches?.[name]?.schedule?.[dName]?.is_closed !== curr.branches?.[name]?.schedule?.[dName]?.is_closed
                                                                    }
                                                                >
                                                                  {({ getFieldValue }) => {
                                                                    const isClosed = getFieldValue(['branches', name, 'schedule', dName, 'is_closed']);
                                                                    return !isClosed ? (
                                                                      <Form.Item
                                                                          {...dRestField}
                                                                          name={[dName, 'timeRange']}
                                                                          className="mb-0 flex-1"
                                                                      >
                                                                          <TimePicker.RangePicker format="HH:mm" className="w-full" size="small" />
                                                                      </Form.Item>
                                                                    ) : (
                                                                      <Text type="secondary" className="italic text-xs flex-1">{t("dayOff") || "Day off"}</Text>
                                                                    );
                                                                  }}
                                                                </Form.Item>
                                                            </div>
                                                        </div>
                                                      );
                                                    })}
                                                </>
                                            )}
                                        </Form.List>
                                    </div>
                                </div>
                            </Card>
                        ))}
                        <Button 
                            type="dashed" 
                            onClick={() => add({ ...DEFAULT_BRANCH, schedule: createDefaultSchedule().map(s => ({ ...s, timeRange: [dayjs("09:00", "HH:mm"), dayjs("21:00", "HH:mm")] })) })} 
                            block 
                            icon={<Plus size={16} />}
                            className="h-12 border-2"
                        >
                            {t("add")} {t("branches") || "Branch"}
                        </Button>
                    </div>
                )}
            </Form.List>

            <div className="flex gap-4 pt-6">
                <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading} 
                    block 
                    size="large"
                    className="h-12 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                >
                    {t("save")}
                </Button>
                <Button 
                    onClick={onCancel} 
                    disabled={loading} 
                    block 
                    size="large"
                    className="h-12 border-border/30"
                >
                    {t("cancel")}
                </Button>
            </div>
        </Form>
    );
}
