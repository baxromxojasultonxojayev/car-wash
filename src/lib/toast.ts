import { message } from "antd";
import i18n from "@/lib/i18n";

const showToast = {
  success: (messageKey: string, customMessage?: string) => {
    const msg = customMessage || i18n.t(messageKey);
    message.success(msg);
  },
  error: (messageKey: string, customMessage?: string) => {
    const msg = customMessage || i18n.t(messageKey);
    message.error(msg);
  },
  info: (messageKey: string, customMessage?: string) => {
    const msg = customMessage || i18n.t(messageKey);
    message.info(msg);
  },
  warning: (messageKey: string, customMessage?: string) => {
    const msg = customMessage || i18n.t(messageKey);
    message.warning(msg);
  },
  // Convenience methods
  loginSuccess: () => message.success(i18n.t("loginSuccess")),
  loginError: (err?: string) => message.error(err || i18n.t("loginError")),
  logoutSuccess: () => message.success(i18n.t("logoutSuccess")),
  saveSuccess: () => message.success(i18n.t("saveSuccess")),
  saveError: (err?: string) => message.error(err || i18n.t("saveError")),
  deleteSuccess: () => message.success(i18n.t("deleteSuccess")),
  deleteError: (err?: string) => message.error(err || i18n.t("deleteError")),
  updateSuccess: () => message.success(i18n.t("updateSuccess")),
  updateError: (err?: string) => message.error(err || i18n.t("updateError")),
  createSuccess: () => message.success(i18n.t("createSuccess")),
  createError: (err?: string) => message.error(err || i18n.t("createError")),
  networkError: () => message.error(i18n.t("networkError")),
  serverError: () => message.error(i18n.t("serverError")),
  fetchError: () => message.error(i18n.t("fetchError")),
  unknownError: () => message.error(i18n.t("unknownError")),
};

export default showToast;
