// lib/i18n.ts
"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  uz: {
    translation: {
      // Navigation
      dashboard: "Bosh sahifa",
      users: "Foydalanuvchilar",
      companies: "Kompaniyalar",
      kiosks: "Kiosklar",
      rfidCards: "RFID Kartalar",
      reports: "Hisobotlar",
      services: "Xizmatlar",
      logout: "Chiqish",
      admin: "Admin",
      
      // Auth
      email: "Email manzili",
      password: "Parol",
      signIn: "Kirish",
      loggingIn: "Kirish jarayonida...",
      adminManagementSystem: "Admin Boshqaruvi Tizimi",
      demo: "Demo: Kirish uchun istalgan email va parolni ishlating",
      
      // Dashboard
      weeklyRevenue: "Haftalik Daromad",
      paymentMethods: "To'lov Usullari",
      washSessions: "Yuvish Sessiyalari",
      totalSessions: "Jami Sessiyalar",
      totalRevenue: "Jami Daromad",
      activeKiosks: "Faol Kiosklar",
      activeCards: "Faol Kartalar",
      totalUsers: "Jami Foydalanuvchilar",
      todayRevenue: "Bugungi Daromad",
      
      // Common
      total: "Jami",
      active: "Faol",
      inactive: "Nofaol",
      search: "Izlash",
      add: "Qo'shish",
      edit: "Tahrirlash",
      delete: "O'chirish",
      cancel: "Bekor qilish",
      save: "Saqlash",
      close: "Yopish",
      yes: "Ha",
      no: "Yo'q",
      actions: "Amallar",
      date: "Sana",
      createdAt: "Yaratilgan",
      status: "Status",
      notFound: "topilmadi",
      
      // Users page
      newUser: "Yangi Foydalanuvchi",
      editUser: "Foydalanuvchini tahrirlash",
      firstName: "Ism",
      lastName: "Familiya",
      phone: "Telefon",
      role: "Rol",
      deleteUserConfirm: "Foydalanuvchini o'chirmoqchimisiz?",
      userNotFound: "Foydalanuvchi topilmadi",
      searchUserPlaceholder: "Email, ism yoki familya bo'yicha izlash...",
      
      // Companies page
      newCompany: "Yangi Kompaniya",
      editCompany: "Kompaniyani tahrirlash",
      companyName: "Kompaniya nomi",
      description: "Tavsif",
      noDescription: "Tavsif yo'q",
      branches: "Filiallar",
      branch: "filial",
      deleteCompanyConfirm: "Kompaniyani o'chirmoqchimisiz?",
      companyNotFound: "Kompaniya topilmadi",
      searchCompanyPlaceholder: "Kompaniya nomi yoki tavsifi bo'yicha izlash...",
      
      // Kiosks page
      newKiosk: "Yangi Kiosk",
      editKiosk: "Kioskni tahrirlash",
      kioskName: "Kiosk nomi",
      macAddress: "MAC Address",
      deleteKioskConfirm: "Kioskni o'chirmoqchimisiz?",
      kioskNotFound: "Kiosk topilmadi",
      searchKioskPlaceholder: "Nomi yoki MAC address bo'yicha izlash...",
      allStatuses: "Barcha statuslar",
      
      // Kiosk statuses
      statusFree: "Bo'sh",
      statusPayment: "To'lov jarayoni",
      statusActive: "Faol",
      statusPause: "To'xtatilgan",
      statusFinish: "Tugallangan",
      statusError: "Xato",
      statusClosed: "Yopilgan",
      
      // Cards page
      newCard: "Yangi Karta",
      editCard: "Kartani tahrirlash",
      cardNumber: "Karta Raqami",
      balance: "Balans",
      totalBalance: "Umumiy Balans",
      totalCards: "Jami Kartalar",
      activeCards2: "Faol kartalar",
      inactiveCards: "Nofaol kartalar",
      deleteCardConfirm: "Kartani o'chirmoqchimisiz?",
      cardNotFound: "Karta topilmadi",
      searchCardPlaceholder: "Karta raqami bo'yicha izlash...",
      allCards: "Barcha kartalar",
      block: "Bloklash",
      unblock: "Aktivlashtirish",
      
      // Theme
      lightMode: "Yorug' rejim",
      darkMode: "Qorong'u rejim",
      changeTheme: "Temani o'zgartirish",
      changeLanguage: "Tilni o'zgartirish",
    },
  },
  ru: {
    translation: {
      // Navigation
      dashboard: "Главная",
      users: "Пользователи",
      companies: "Компании",
      kiosks: "Киоски",
      rfidCards: "RFID Карты",
      reports: "Отчеты",
      services: "Услуги",
      logout: "Выход",
      admin: "Администратор",
      
      // Auth
      email: "Email адрес",
      password: "Пароль",
      signIn: "Вход",
      loggingIn: "Вход...",
      adminManagementSystem: "Система управления",
      demo: "Демо: используйте любой email и пароль для входа",
      
      // Dashboard
      weeklyRevenue: "Недельная выручка",
      paymentMethods: "Способы оплаты",
      washSessions: "Сеансы мойки",
      totalSessions: "Всего сеансов",
      totalRevenue: "Общая выручка",
      activeKiosks: "Активные киоски",
      activeCards: "Активные карты",
      totalUsers: "Всего пользователей",
      todayRevenue: "Выручка за сегодня",
      
      // Common
      total: "Всего",
      active: "Активный",
      inactive: "Неактивный",
      search: "Поиск",
      add: "Добавить",
      edit: "Редактировать",
      delete: "Удалить",
      cancel: "Отмена",
      save: "Сохранить",
      close: "Закрыть",
      yes: "Да",
      no: "Нет",
      actions: "Действия",
      date: "Дата",
      createdAt: "Создано",
      status: "Статус",
      notFound: "не найдено",
      
      // Users page
      newUser: "Новый пользователь",
      editUser: "Редактировать пользователя",
      firstName: "Имя",
      lastName: "Фамилия",
      phone: "Телефон",
      role: "Роль",
      deleteUserConfirm: "Удалить пользователя?",
      userNotFound: "Пользователь не найден",
      searchUserPlaceholder: "Поиск по email, имени или фамилии...",
      
      // Companies page
      newCompany: "Новая компания",
      editCompany: "Редактировать компанию",
      companyName: "Название компании",
      description: "Описание",
      noDescription: "Нет описания",
      branches: "Филиалы",
      branch: "филиал",
      deleteCompanyConfirm: "Удалить компанию?",
      companyNotFound: "Компания не найдена",
      searchCompanyPlaceholder: "Поиск по названию или описанию...",
      
      // Kiosks page
      newKiosk: "Новый киоск",
      editKiosk: "Редактировать киоск",
      kioskName: "Название киоска",
      macAddress: "MAC адрес",
      deleteKioskConfirm: "Удалить киоск?",
      kioskNotFound: "Киоск не найден",
      searchKioskPlaceholder: "Поиск по названию или MAC адресу...",
      allStatuses: "Все статусы",
      
      // Kiosk statuses
      statusFree: "Свободен",
      statusPayment: "Оплата",
      statusActive: "Активен",
      statusPause: "Приостановлен",
      statusFinish: "Завершен",
      statusError: "Ошибка",
      statusClosed: "Закрыт",
      
      // Cards page
      newCard: "Новая карта",
      editCard: "Редактировать карту",
      cardNumber: "Номер карты",
      balance: "Баланс",
      totalBalance: "Общий баланс",
      totalCards: "Всего карт",
      activeCards2: "Активные карты",
      inactiveCards: "Неактивные карты",
      deleteCardConfirm: "Удалить карту?",
      cardNotFound: "Карта не найдена",
      searchCardPlaceholder: "Поиск по номеру карты...",
      allCards: "Все карты",
      block: "Заблокировать",
      unblock: "Активировать",
      
      // Theme
      lightMode: "Светлая тема",
      darkMode: "Темная тема",
      changeTheme: "Сменить тему",
      changeLanguage: "Сменить язык",
    },
  },
  en: {
    translation: {
      // Navigation
      dashboard: "Dashboard",
      users: "Users",
      companies: "Companies",
      kiosks: "Kiosks",
      rfidCards: "RFID Cards",
      reports: "Reports",
      services: "Services",
      logout: "Logout",
      admin: "Admin",
      
      // Auth
      email: "Email Address",
      password: "Password",
      signIn: "Sign In",
      loggingIn: "Logging in...",
      adminManagementSystem: "Admin Management System",
      demo: "Demo: Use any email and password to login",
      
      // Dashboard
      weeklyRevenue: "Weekly Revenue",
      paymentMethods: "Payment Methods",
      washSessions: "Wash Sessions",
      totalSessions: "Total Sessions",
      totalRevenue: "Total Revenue",
      activeKiosks: "Active Kiosks",
      activeCards: "Active Cards",
      totalUsers: "Total Users",
      todayRevenue: "Today's Revenue",
      
      // Common
      total: "Total",
      active: "Active",
      inactive: "Inactive",
      search: "Search",
      add: "Add",
      edit: "Edit",
      delete: "Delete",
      cancel: "Cancel",
      save: "Save",
      close: "Close",
      yes: "Yes",
      no: "No",
      actions: "Actions",
      date: "Date",
      createdAt: "Created",
      status: "Status",
      notFound: "not found",
      
      // Users page
      newUser: "New User",
      editUser: "Edit User",
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone",
      role: "Role",
      deleteUserConfirm: "Delete this user?",
      userNotFound: "User not found",
      searchUserPlaceholder: "Search by email, first or last name...",
      
      // Companies page
      newCompany: "New Company",
      editCompany: "Edit Company",
      companyName: "Company Name",
      description: "Description",
      noDescription: "No description",
      branches: "Branches",
      branch: "branch",
      deleteCompanyConfirm: "Delete this company?",
      companyNotFound: "Company not found",
      searchCompanyPlaceholder: "Search by name or description...",
      
      // Kiosks page
      newKiosk: "New Kiosk",
      editKiosk: "Edit Kiosk",
      kioskName: "Kiosk Name",
      macAddress: "MAC Address",
      deleteKioskConfirm: "Delete this kiosk?",
      kioskNotFound: "Kiosk not found",
      searchKioskPlaceholder: "Search by name or MAC address...",
      allStatuses: "All Statuses",
      
      // Kiosk statuses
      statusFree: "Free",
      statusPayment: "Payment",
      statusActive: "Active",
      statusPause: "Paused",
      statusFinish: "Finished",
      statusError: "Error",
      statusClosed: "Closed",
      
      // Cards page
      newCard: "New Card",
      editCard: "Edit Card",
      cardNumber: "Card Number",
      balance: "Balance",
      totalBalance: "Total Balance",
      totalCards: "Total Cards",
      activeCards2: "Active Cards",
      inactiveCards: "Inactive Cards",
      deleteCardConfirm: "Delete this card?",
      cardNotFound: "Card not found",
      searchCardPlaceholder: "Search by card number...",
      allCards: "All Cards",
      block: "Block",
      unblock: "Unblock",
      
      // Theme
      lightMode: "Light Mode",
      darkMode: "Dark Mode",
      changeTheme: "Change Theme",
      changeLanguage: "Change Language",
    },
  },
} as const;

const STORAGE_KEY = "language";

function detectInitialLanguage(): string {
  if (typeof window === "undefined") {
    return "uz";
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);

  if (saved === "uz" || saved === "ru" || saved === "en") {
    return saved;
  }

  return "uz";
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: detectInitialLanguage(),
    fallbackLng: "uz",
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
