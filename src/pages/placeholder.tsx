import { useTranslation } from "react-i18next";

export default function PlaceholderPage({ title }: { title?: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent animate-spin rounded-full" />
      </div>
      <h1 className="text-3xl font-bold text-foreground">
        {title || t("comingSoon") || "Tez kunda..."}
      </h1>
      <p className="text-muted-foreground max-w-md">
        Ushbu bo'lim hozirda ishlab chiqilmoqda. Tez orada barcha funksiyalar ishga tushiriladi.
      </p>
    </div>
  );
}
