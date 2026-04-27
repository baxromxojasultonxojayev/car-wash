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
  Home,
  Users,
  Clock,
  FileText,
  ClipboardList,
} from "lucide-react";
import { TFunction } from "i18next";
import { UserRole } from "../lib/auth";

export type MenuItem = {
  id: string;
  label: string;
  icon: any;
  path?: string;
  roles?: UserRole[];
  subItems?: MenuItem[];
};

export const getMenuStructure = (t: TFunction): MenuItem[] => [
  // --- GENERAL / ГЛАВНАЯ ---
  {
    id: "general_group",
    label: t("menuGeneral"),
    icon: LayoutDashboard,
    roles: ["client_admin", "super_admin"],
    subItems: [
      {
        id: "dashboard",
        label: t("controlPanel"),
        icon: LayoutDashboard,
        path: "/dashboard",
        roles: ["client_admin", "super_admin"],
      },
      {
        id: "my_company",
        label: t("myCompany"),
        icon: Home,
        path: "/my-company",
        roles: ["client_admin"],
      },
    ],
  },

  // --- MANAGEMENT / УПРАВЛЕНИЕ ---
  {
    id: "management_group",
    label: t("menuManagement"),
    icon: Users,
    roles: ["client_admin", "super_admin"],
    subItems: [
      {
        id: "partners",
        label: t("partnersOrgs"),
        icon: Building2,
        path: "/organizations",
        roles: ["super_admin"],
      },
      {
        id: "my_branches",
        label: t("myBranches"),
        icon: Navigation,
        path: "/branches",
        roles: ["client_admin"],
      },
      {
        id: "my_specialists",
        label: t("mySpecialists"),
        icon: Users,
        path: "/specialists",
        roles: ["client_admin"],
      },
      {
        id: "admins",
        label: t("adminsManagers"),
        icon: UserSquare2,
        path: "/accounts",
        roles: ["client_admin", "super_admin"],
      },
      {
        id: "spec_requests",
        label: t("specRequests"),
        icon: ClipboardList,
        path: "/specialist-requests",
        roles: ["client_admin"],
      },
      {
        id: "clients",
        label: t("clientsMobile"),
        icon: Smartphone,
        path: "/clients",
        roles: ["super_admin"],
      },
    ],
  },

  // --- FIELD SERVICES / ВЫЕЗДНЫЕ УСЛУГИ ---
  {
    id: "field_services_group",
    label: t("menuFieldServices"),
    icon: Navigation,
    roles: ["client_admin"],
    subItems: [
      {
        id: "orders",
        label: t("orders"),
        icon: Navigation,
        path: "/orders",
        roles: ["client_admin"],
      },
      {
        id: "working_hours",
        label: t("workingHours"),
        icon: Clock,
        path: "/working-hours",
        roles: ["client_admin"],
      },
      {
        id: "plans_quotas",
        label: t("plansQuotas"),
        icon: BarChart3,
        path: "/plans-quotas",
        roles: ["client_admin"],
      },
    ],
  },

  // --- EQUIPMENT / ОБОРУДОВАНИЕ ---
  {
    id: "equipment_group",
    label: t("menuEquipment"),
    icon: Cpu,
    roles: ["client_admin", "super_admin"],
    subItems: [
      { 
        id: "kiosks", 
        label: t("hardwareKiosks"), 
        icon: Zap, 
        path: "/kiosks",
        roles: ["client_admin", "super_admin"],
      },
      {
        id: "firmware",
        label: t("otaFirmware"),
        icon: Wrench,
        path: "/firmware",
        roles: ["client_admin", "super_admin"],
      },
      { 
        id: "rfid", 
        label: t("rfidCards"), 
        icon: CreditCard, 
        path: "/cards",
        roles: ["client_admin", "super_admin"],
      },
      {
        id: "devices",
        label: t("allDevices"),
        icon: Monitor,
        path: "/devices",
        roles: ["super_admin"],
      },
    ],
  },

  // --- REPORTS & OTHER / ОТЧЁТЫ И ПРОЧЕЕ ---
  {
    id: "reports_group",
    label: t("menuReportsOther"),
    icon: FileText,
    roles: ["client_admin", "super_admin"],
    subItems: [
      {
        id: "sessions",
        label: t("washSessions"),
        icon: Waves,
        path: "/sessions",
        roles: ["client_admin", "super_admin"],
      },
      {
        id: "networkReports",
        label: t("networkReports"),
        icon: FileText,
        path: "/reports",
        roles: ["client_admin", "super_admin"],
      },
      {
        id: "promotions",
        label: t("myPromotions"),
        icon: Tag,
        path: "/promotions",
        roles: ["client_admin", "super_admin"],
      },
      {
        id: "reviews",
        label: t("reviewsRatings"),
        icon: MessageSquare,
        path: "/reviews",
        roles: ["client_admin", "super_admin"],
      },
      {
        id: "services",
        label: t("menuServices"),
        icon: Settings2,
        path: "/services",
        roles: ["client_admin", "super_admin"],
      },
    ],
  },

  // --- FINANCE (Super Admin only or moved) ---
  {
    id: "finance",
    label: t("menuFinance"),
    icon: Wallet,
    roles: ["super_admin"],
    subItems: [
      {
        id: "paymentReports",
        label: t("paymentReports"),
        icon: Receipt,
        path: "/payment-reports",
        roles: ["super_admin"],
      },
      {
        id: "commissions",
        label: t("platformCommissions"),
        icon: Percent,
        path: "/commissions",
        roles: ["super_admin"],
      },
      {
        id: "acquiring",
        label: t("acquiringHamkor"),
        icon: Wallet,
        path: "/acquiring",
        roles: ["super_admin"],
      },
    ],
  },

  // --- SETTINGS ---
  {
    id: "settings",
    label: t("settingsPanel"),
    icon: Sliders,
    roles: ["super_admin"],
    subItems: [
      {
        id: "platformSettings",
        label: t("platformSettings"),
        icon: Sliders,
        path: "/platform-settings",
        roles: ["super_admin"],
      },
      {
        id: "migration",
        label: t("dbMigrationExport"),
        icon: Database,
        path: "/migration",
        roles: ["super_admin"],
      },
    ],
  },
];
