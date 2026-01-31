"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Globe } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { apiPost } from "@/lib/api";

type LoginRequest = {
  username: string;
  password: string;
};

type LoginResponse = any;

function extractToken(payload: any): string | null {
  console.log("payload", payload);

  return (
    payload?.token ||
    payload?.access_token ||
    payload?.accessToken ||
    payload?.data?.token ||
    payload?.data?.access_token ||
    payload?.data?.accessToken ||
    null
  );
}

export function LoginForm() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);

    const token = localStorage.getItem("access_token");

    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const body: LoginRequest = {
        username: email,
        password,
      };

      const res = await apiPost<LoginResponse>("/auth/login", body);

      const token = extractToken(res);

      if (token) {
        localStorage.setItem("access_token", token);
        localStorage.setItem("refresh_token", res?.refresh_token);
      } else {
        localStorage.setItem("login_payload", JSON.stringify(res ?? {}));
      }

      router.replace("/dashboard");
    } catch (err: any) {
      let msg = "Login error. Username or password may be incorrect.";
      
      if (typeof err?.message === "string") {
        msg = err.message;
      } else if (typeof err?.details?.message === "string") {
        msg = err.details.message;
      } else if (err?.details?.detail) {
        const detail = err.details.detail;
        if (typeof detail === "string") {
          msg = detail;
        } else if (Array.isArray(detail)) {
          msg = detail.map((d: any) => d?.msg || JSON.stringify(d)).join(", ");
        } else if (typeof detail === "object") {
          msg = detail?.msg || JSON.stringify(detail);
        }
      }
      
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

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card/50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="absolute top-6 right-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 hover:bg-card/50 rounded-lg transition-colors border border-border/20">
                <Globe size={20} className="text-foreground" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLanguage("uz")}>
                O'zbek (UZ)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage("ru")}>
                Русский (RU)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage("en")}>
                English (EN)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Card className="border border-border/30 bg-card/60 backdrop-blur-xl shadow-2xl">
          <div className="p-8">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-foreground mb-2">
                CarWash
              </h1>
              <p className="text-muted-foreground text-sm font-medium">
                {t("adminManagementSystem")}
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg border border-red-500/40 bg-red-500/10 text-sm text-red-200">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-foreground"
                >
                  {t("email")}
                </label>

                <Input
                  id="email"
                  type="text"
                  placeholder="admin@carwash.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-input border-border/40 text-foreground placeholder:text-muted-foreground/50 h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-foreground"
                >
                  {t("password")}
                </label>

                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input border-border/40 text-foreground placeholder:text-muted-foreground/50 h-11"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 transition-all"
              >
                {loading ? t("loggingIn") : t("signIn")}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
              <p className="text-xs text-muted-foreground">{t("demo")}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
