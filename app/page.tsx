"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    router.replace(token ? "/dashboard" : "/login");
  }, [router]);

  return null;
}

// import type React from "react";
// import { useState, useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import { Globe } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const { t, i18n } = useTranslation();
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//     const storedEmail = localStorage.getItem("userEmail");
//     if (storedEmail) {
//       router.push("/dashboard");
//     }
//   }, [router]);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     setTimeout(() => {
//       if (email && password) {
//         localStorage.setItem("userEmail", email);
//         router.push("/dashboard");
//       }
//       setLoading(false);
//     }, 500);
//   };

//   const changeLanguage = (lang: string) => {
//     i18n.changeLanguage(lang);
//     if (typeof window !== "undefined") {
//       window.localStorage.setItem("language", lang);
//     }
//   };

//   if (!mounted) return null;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background to-card/50 flex items-center justify-center px-4 py-8">
//       <div className="w-full max-w-md">
//         <div className="absolute top-6 right-6">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <button className="p-2 hover:bg-card/50 rounded-lg transition-colors border border-border/20">
//                 <Globe size={20} className="text-foreground" />
//               </button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem onClick={() => changeLanguage("uz")}>
//                 Ўзбек (UZ)
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => changeLanguage("ru")}>
//                 Русский (RU)
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => changeLanguage("en")}>
//                 English (EN)
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>

//         <Card className="border border-border/30 bg-card/60 backdrop-blur-xl shadow-2xl">
//           <div className="p-8">
//             <div className="mb-8 text-center">
//               <h1 className="text-4xl font-bold text-foreground mb-2">
//                 CarWash
//               </h1>
//               <p className="text-muted-foreground text-sm font-medium">
//                 {t("adminManagementSystem")}
//               </p>
//             </div>

//             <form onSubmit={handleLogin} className="space-y-5">
//               <div className="space-y-2">
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-semibold text-foreground"
//                 >
//                   {t("email")}
//                 </label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="admin@carwash.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="bg-input border-border/40 text-foreground placeholder:text-muted-foreground/50 h-11"
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label
//                   htmlFor="password"
//                   className="block text-sm font-semibold text-foreground"
//                 >
//                   {t("password")}
//                 </label>
//                 <Input
//                   id="password"
//                   type="password"
//                   placeholder="••••••••"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="bg-input border-border/40 text-foreground placeholder:text-muted-foreground/50 h-11"
//                   required
//                 />
//               </div>

//               <Button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 transition-all"
//               >
//                 {loading ? t("loggingIn") : t("signIn")}
//               </Button>
//             </form>

//             <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
//               <p className="text-xs text-muted-foreground">{t("demo")}</p>
//             </div>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// }
