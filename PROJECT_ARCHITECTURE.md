# Project Architecture & Guidelines: CarWash Dashboard

Ushbu hujjat loyihaning arxitekturasi, strukturasi va dasturlash standartlarini tavsiflaydi. Kelajakdagi barcha o'zgarishlar ushbu qoidalarga muvofiq amalga oshirilishi shart.

## 1. Texnologiyalar Steki (Tech Stack)

- **Framework**: React (Vite asosida)
- **Styling**: Tailwind CSS + Vanilla CSS/SCSS (komponent darajasida)
- **Theming**: `next-themes` (Global) + `theme-utils.ts` (Sidebar-specific)
- **Localization**: `i18next` + `react-i18next` (ko'p tilli qo'llab-quvvatlash)
- **Icons**: `lucide-react`
- **State Management**: React Hooks (useState, useEffect, useContext)

## 2. Loyiha Strukturasi (Directory Structure)

```text
src/
├── components/          # Qayta ishlatiladigan UI va Layout komponentlari
│   ├── ui/              # Atomik komponentlar (Button, Switch, Dropdown va h.k.)
│   └── Layout/          # Dashboard strukturasi (Header, Sidebar, SettingsPanel)
├── constants/           # Statik ma'lumotlar va konfiguratsiyalar (Masalan: menu-items.ts)
├── hooks/               # Maxsus React hooklari
├── lib/                 # Biznes mantiq, utilitalar va providerlar (Auth, i18n, Theme-utils)
├── pages/               # Sahifalar (Dashboard, Organizations, Login va h.k.)
├── router.tsx           # Marshrutlash (Routing) mantiqi
├── globals.css          # Global uslublar va CSS o'zgaruvchilari
└── main.tsx             # Kirish nuqtasi
```

## 3. Asosiy Tizimlar (Core Systems)

### A. Mavzulashtirish (Theming)

Loyihada bir-biridan mustaqil ikki turdagi mavzu boshqariladi:

- **Global Layout**: "Light" va "Dark" rejimlari.
- **Sidebar Theme**: Layoutdan qat'iy nazar mustaqil rangga ega bo'lishi mumkin (oq yoki qora).
- **Header Color**: Foydalanuvchi tanlagan rang header foniga va sidebar aktiv elementlariga ta'sir qiladi.

### B. Lokalizatsiya (Localization)

Barcha matnlar `public/locales/{uz|ru|en}/translation.json` fayllarida saqlanadi.

- Yangi matn qo'shishda doim 3 ta tilda qo'shish talab etiladi.
- Komponentlarda `t('key')` funksiyasidan foydalaniladi.

### C. Navigatsiya (Navigation)

Sidebar menyusi `src/constants/menu-items.ts` faylidan olinadi.

- **Submenyu**: Menyular mantiqiy ierarxiyaga ega.
- **Rollarga asoslangan**: Kelajakda super_admin va boshqa rollar uchun menyular shu faylda ajratiladi.

## 4. Dasturlash Standartlari (Coding Standards)

1.  **Modullik**: Ma'lumotlarni komponent ichida emas, alohida config fayllarda saqlang.
2.  **Performance**:
    - `backdrop-filter: blur()` kabi og'ir effektlardan qoching.
    - Doimiy animatsiyalarni (infinite spinning) cheklang.
3.  **UI/UX**:
    - Premium estetika: Gradientlar, yumshoq soyalar va o'tish (transition) effektlaridan foydalaning.
    - Responsive: Barcha komponentlar mobil qurilmalarda ham to'g'ri ko'rinishi shart.
4.  **Toza kod**: Komponentlarni kichik modullarga bo'lib yozing va ortiqcha (`dead code`) kodlarni saqlamang.

---

_Ushbu hujjat har safar loyihani yangilashdan oldin qayta ko'rib chiqilishi kerak._
