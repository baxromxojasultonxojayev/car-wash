import {
  LayoutDashboard,
  Building2,
  Smartphone,
  Cpu,
  Monitor,
  Wrench,
  UserSquare2,
  CreditCard,
  BarChart3,
  Tag,
  BookOpen,
  Settings2,
  Waves,
  Navigation,
  DollarSign,
  Settings,
  Receipt,
  Percent,
  Wallet,
  MessageSquare,
  Sliders,
  Database,
  PieChart,
  Zap,
} from "lucide-react";
import { TFunction } from "i18next";

export type MenuItem = {
  id: string;
  label: string;
  icon: any;
  path?: string;
  subItems?: MenuItem[];
};

export const getMenuStructure = (t: TFunction): MenuItem[] => [
  {
    id: "dashboard",
    label: t("controlPanel"),
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "orgs",
    label: t("menuOrgsUsers"),
    icon: Building2,
    subItems: [
      {
        id: "partners",
        label: t("partnersOrgs"),
        icon: Building2,
        path: "/organizations",
      },
      {
        id: "branches",
        label: t("branchesLocations"),
        icon: Navigation,
        path: "/branches",
      },
      {
        id: "clients",
        label: t("clientsMobile"),
        icon: Smartphone,
        path: "/clients",
      },
      {
        id: "admins",
        label: t("adminsManagers"),
        icon: UserSquare2,
        path: "/accounts",
      },
    ],
  },
  {
    id: "equipment",
    label: t("menuEquipment"),
    icon: Cpu,
    subItems: [
      { id: "kiosks", label: t("hardwareKiosks"), icon: Zap, path: "/kiosks" },
      {
        id: "devices",
        label: t("allDevices"),
        icon: Monitor,
        path: "/devices",
      },
      {
        id: "firmware",
        label: t("otaFirmware"),
        icon: Wrench,
        path: "/firmware",
      },
      { id: "rfid", label: t("rfidCards"), icon: CreditCard, path: "/cards" },
    ],
  },
  {
    id: "services",
    label: t("menuServices"),
    icon: Settings2,
    subItems: [
      {
        id: "templates",
        label: t("servicesTemplates"),
        icon: Settings2,
        path: "/services",
      },
      {
        id: "promotions",
        label: t("promotionsDiscounts"),
        icon: Tag,
        path: "/promotions",
      },
      {
        id: "fieldMap",
        label: t("fieldServicesMap"),
        icon: Navigation,
        path: "/field-map",
      },
      {
        id: "fieldPrices",
        label: t("fieldServicesPrices"),
        icon: DollarSign,
        path: "/field-prices",
      },
      {
        id: "pricing",
        label: t("priceDynamics"),
        icon: Settings,
        path: "/price-goods",
      },
      {
        id: "mechanic",
        label: t("mechanicLibrary"),
        icon: BookOpen,
        path: "/mechanic-library",
      },
    ],
  },
  {
    id: "ops",
    label: t("menuOps"),
    icon: Waves,
    subItems: [
      {
        id: "sessions",
        label: t("washSessions"),
        icon: Waves,
        path: "/sessions",
      },
      {
        id: "reviews",
        label: t("reviewsRatings"),
        icon: MessageSquare,
        path: "/reviews",
      },
    ],
  },
  {
    id: "finance",
    label: t("menuFinance"),
    icon: Wallet,
    subItems: [
      {
        id: "paymentReports",
        label: t("paymentReports"),
        icon: Receipt,
        path: "/payment-reports",
      },
      {
        id: "commissions",
        label: t("platformCommissions"),
        icon: Percent,
        path: "/commissions",
      },
      {
        id: "acquiring",
        label: t("acquiringHamkor"),
        icon: Wallet,
        path: "/acquiring",
      },
    ],
  },
  {
    id: "analytics",
    label: t("menuAnalytics"),
    icon: PieChart,
    subItems: [
      {
        id: "networkReports",
        label: t("networkReports"),
        icon: BarChart3,
        path: "/reports",
      },
      {
        id: "analytics",
        label: t("platformAnalytics"),
        icon: PieChart,
        path: "/analytics",
      },
    ],
  },
  {
    id: "settings",
    label: t("settingsPanel"),
    icon: Sliders,
    subItems: [
      {
        id: "platformSettings",
        label: t("platformSettings"),
        icon: Sliders,
        path: "/platform-settings",
      },
      {
        id: "migration",
        label: t("dbMigrationExport"),
        icon: Database,
        path: "/migration",
      },
    ],
  },
];
