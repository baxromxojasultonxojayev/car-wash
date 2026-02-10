import { toast } from "sonner";
import i18n from "@/lib/i18n";

export const showToast = {
  success: (messageKey: string, customMessage?: string) => {
    const message = customMessage || i18n.t(messageKey);
    toast.success(message);
  },
  error: (messageKey: string, customMessage?: string) => {
    const message = customMessage || i18n.t(messageKey);
    toast.error(message);
  },
  info: (messageKey: string, customMessage?: string) => {
    const message = customMessage || i18n.t(messageKey);
    toast.info(message);
  },
  warning: (messageKey: string, customMessage?: string) => {
    const message = customMessage || i18n.t(messageKey);
    toast.warning(message);
  },
  // Convenience methods
  loginSuccess: () => toast.success(i18n.t("loginSuccess")),
  loginError: (err?: string) => toast.error(err || i18n.t("loginError")),
  logoutSuccess: () => toast.success(i18n.t("logoutSuccess")),
  saveSuccess: () => toast.success(i18n.t("saveSuccess")),
  saveError: (err?: string) => toast.error(err || i18n.t("saveError")),
  deleteSuccess: () => toast.success(i18n.t("deleteSuccess")),
  deleteError: (err?: string) => toast.error(err || i18n.t("deleteError")),
  updateSuccess: () => toast.success(i18n.t("updateSuccess")),
  updateError: (err?: string) => toast.error(err || i18n.t("updateError")),
  createSuccess: () => toast.success(i18n.t("createSuccess")),
  createError: (err?: string) => toast.error(err || i18n.t("createError")),
  networkError: () => toast.error(i18n.t("networkError")),
  serverError: () => toast.error(i18n.t("serverError")),
  fetchError: () => toast.error(i18n.t("fetchError")),
  unknownError: () => toast.error(i18n.t("unknownError")),
};

export default showToast;
