import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, Input, Card, Dropdown, MenuProps, Space } from "antd";
import { Globe, Eye, EyeOff, Loader2, UserSquare2, Lock } from "lucide-react";

import { useAuth } from "@/lib/auth";
import showToast from "@/lib/toast";

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await login(loginValue, password);
      showToast.loginSuccess();
      navigate("/dashboard");
    } catch (err: any) {
      const msg = typeof err?.message === "string" ? err.message : t("loginError");
      showToast.loginError(msg);
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("language", lang);
    }
  };

  const langItems: MenuProps['items'] = [
    { key: 'uz', label: "O'zbek (UZ)", onClick: () => changeLanguage('uz') },
    { key: 'ru', label: "Русский (RU)", onClick: () => changeLanguage('ru') },
    { key: 'en', label: "English (EN)", onClick: () => changeLanguage('en') },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card/50 flex items-center justify-center px-4 py-8 relative">
      <div className="absolute top-6 right-6">
        <Dropdown menu={{ items: langItems }} placement="bottomRight" arrow>
          <Button 
            icon={<Globe size={20} />} 
            className="flex items-center justify-center border-border/20 bg-card/40 backdrop-blur-sm hover:bg-card/60 transition-colors"
            size="large"
          />
        </Dropdown>
      </div>

      <div className="w-full max-w-md">
        <Card 
          className="border border-border/30 bg-card/60 backdrop-blur-xl shadow-2xl"
          bordered={false}
        >
          <div className="p-2">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-foreground mb-2">
                CarWash
              </h1>
              <p className="text-muted-foreground text-sm font-medium">
                {t("adminManagementSystem")}
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-3 rounded-lg border border-red-500/40 bg-red-500/10 text-sm text-red-200">
                {errorMsg}
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  {t("username")}
                </label>
                <Input
                  size="large"
                  placeholder="SuperAdmin"
                  prefix={<UserSquare2 size={18} className="text-muted-foreground mr-1" />}
                  value={loginValue}
                  onChange={(e) => setLoginValue(e.target.value)}
                  className="bg-input/50 border-border/40 hover:border-primary focus:border-primary transition-all h-12"
                  disabled={loading}
                  onPressEnter={handleLogin}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">
                  {t("password")}
                </label>
                <Input.Password
                  size="large"
                  placeholder="••••••••"
                  prefix={<Lock size={18} className="text-muted-foreground mr-1" />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input/50 border-border/40 hover:border-primary focus:border-primary transition-all h-12"
                  disabled={loading}
                  iconRender={(visible) => (visible ? <Eye size={18} /> : <EyeOff size={18} />)}
                  onPressEnter={handleLogin}
                />
              </div>

              <Button
                type="primary"
                size="large"
                block
                loading={loading}
                onClick={handleLogin}
                className="h-12 font-bold text-base shadow-lg shadow-primary/20 mt-2"
              >
                {loading ? t("loggingIn") : t("signIn")}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
