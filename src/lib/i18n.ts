import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

if (!i18n.isInitialized) {
  i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: "uz",
      lng: localStorage.getItem("language") || "uz",
      debug: false,
      interpolation: {
        escapeValue: false,
      },
      backend: {
        // Use relative path for better compatibility with dev servers
        loadPath: "/locales/{{lng}}/translation.json",
      },
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
        lookupLocalStorage: "language",
      },
      react: {
        useSuspense: false, // Handle loading state manually in components
      },
    });
}

export default i18n;
