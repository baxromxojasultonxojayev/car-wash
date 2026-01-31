"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit2, Trash2, Search, CreditCard, Lock, Unlock, X } from "lucide-react";
import CardForm from "@/components/cards/card-form";

interface RFIDCard {
  id: string;
  cardNumber: string;
  balance: number;
  isActive: boolean;
  createdAt: string;
  companyId?: string;
  ownerId?: string;
}

export default function CardsPage() {
  const { t } = useTranslation();

  const [cards, setCards] = useState<RFIDCard[]>([
    {
      id: "1",
      cardNumber: "1234567890AB",
      balance: 50000,
      isActive: true,
      createdAt: "2024-01-15",
      companyId: "1",
      ownerId: "1",
    },
    {
      id: "2",
      cardNumber: "1234567890AC",
      balance: 25000,
      isActive: true,
      createdAt: "2024-01-20",
      companyId: "1",
      ownerId: "2",
    },
    {
      id: "3",
      cardNumber: "1234567890AD",
      balance: 0,
      isActive: false,
      createdAt: "2024-02-01",
      companyId: "1",
    },
    {
      id: "4",
      cardNumber: "1234567890AE",
      balance: 75000,
      isActive: true,
      createdAt: "2024-02-05",
      companyId: "2",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<RFIDCard | null>(null);

  const filteredCards = cards.filter((card) => {
    const matchesSearch = card.cardNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && card.isActive) ||
      (statusFilter === "inactive" && !card.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleAddCard = (formData: Omit<RFIDCard, "id" | "createdAt">) => {
    const newCard: RFIDCard = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setCards([...cards, newCard]);
    setIsFormOpen(false);
  };

  const handleUpdateCard = (formData: Omit<RFIDCard, "id" | "createdAt">) => {
    if (!editingCard) return;
    const updatedCards = cards.map((card) =>
      card.id === editingCard.id ? { ...card, ...formData } : card
    );
    setCards(updatedCards);
    setEditingCard(null);
    setIsFormOpen(false);
  };

  const handleDeleteCard = (id: string) => {
    if (confirm(t("deleteCardConfirm"))) {
      setCards(cards.filter((card) => card.id !== id));
    }
  };

  const handleEditCard = (card: RFIDCard) => {
    setEditingCard(card);
    setIsFormOpen(true);
  };

  const handleToggleStatus = (id: string) => {
    const updatedCards = cards.map((card) =>
      card.id === id ? { ...card, isActive: !card.isActive } : card
    );
    setCards(updatedCards);
  };

  const closeModal = () => {
    setIsFormOpen(false);
    setEditingCard(null);
  };

  const stats = {
    total: cards.length,
    active: cards.filter((c) => c.isActive).length,
    inactive: cards.filter((c) => !c.isActive).length,
    totalBalance: cards.reduce((sum, c) => sum + c.balance, 0),
  };

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t("rfidCards")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("total")} {cards.length} ta
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCard(null);
            setIsFormOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full sm:w-auto"
        >
          <Plus size={20} />
          {t("newCard")}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <Card className="bg-card border border-border/20 p-3 sm:p-4">
          <p className="text-muted-foreground text-[10px] sm:text-sm mb-1">{t("totalCards")}</p>
          <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.total}</p>
        </Card>
        <Card className="bg-card border border-border/20 p-3 sm:p-4">
          <p className="text-muted-foreground text-[10px] sm:text-sm mb-1">{t("active")}</p>
          <p className="text-xl sm:text-2xl font-bold text-green-500">{stats.active}</p>
        </Card>
        <Card className="bg-card border border-border/20 p-3 sm:p-4">
          <p className="text-muted-foreground text-[10px] sm:text-sm mb-1">{t("inactive")}</p>
          <p className="text-xl sm:text-2xl font-bold text-red-500">{stats.inactive}</p>
        </Card>
        <Card className="bg-card border border-border/20 p-3 sm:p-4">
          <p className="text-muted-foreground text-[10px] sm:text-sm mb-1">{t("totalBalance")}</p>
          <p className="text-base sm:text-xl font-bold text-cyan-500 truncate">{formatBalance(stats.totalBalance)}</p>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Card className="bg-card border border-border/20 p-3 sm:p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder={t("searchCardPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-input text-foreground border-border/30 text-sm"
            />
          </div>
        </Card>

        <Card className="bg-card border border-border/20 p-3 sm:p-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
            className="w-full px-3 py-2 bg-input text-foreground border border-border/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">{t("allCards")}</option>
            <option value="active">{t("activeCards2")}</option>
            <option value="inactive">{t("inactiveCards")}</option>
          </select>
        </Card>
      </div>

      {/* Card Form Modal */}
      {isFormOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <Card
            className="w-full max-w-md bg-card border border-border/20 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                  {editingCard ? t("editCard") : t("newCard")}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-muted-foreground hover:text-foreground p-1 hover:bg-accent rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <CardForm
                card={editingCard}
                onSubmit={editingCard ? handleUpdateCard : handleAddCard}
                onCancel={closeModal}
              />
            </div>
          </Card>
        </div>
      )}

      {/* Mobile Cards View */}
      <div className="block sm:hidden space-y-3">
        {filteredCards.length === 0 ? (
          <Card className="bg-card border border-border/20 p-6 text-center">
            <p className="text-muted-foreground">{t("cardNotFound")}</p>
          </Card>
        ) : (
          filteredCards.map((card) => (
            <Card key={card.id} className="bg-card border border-border/20 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <CreditCard size={16} className="text-blue-500 flex-shrink-0" />
                  <p className="font-mono font-medium text-foreground truncate">{card.cardNumber}</p>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${card.isActive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                  {card.isActive ? <Unlock size={12} /> : <Lock size={12} />}
                  {card.isActive ? t("active") : t("inactive")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-cyan-500">{formatBalance(card.balance)}</p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleStatus(card.id)}
                    className={`p-2 rounded-lg transition-colors ${card.isActive ? "hover:bg-red-500/10 text-red-500" : "hover:bg-green-500/10 text-green-500"}`}
                  >
                    {card.isActive ? <Lock size={16} /> : <Unlock size={16} />}
                  </button>
                  <button
                    onClick={() => handleEditCard(card)}
                    className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <Card className="hidden sm:block bg-card border border-border/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border/20 bg-sidebar/20">
              <tr>
                <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-foreground">
                  {t("cardNumber")}
                </th>
                <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-foreground">
                  {t("balance")}
                </th>
                <th className="px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-foreground">
                  {t("status")}
                </th>
                <th className="hidden lg:table-cell px-3 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-foreground">
                  {t("date")}
                </th>
                <th className="px-3 lg:px-6 py-3 lg:py-4 text-right text-xs lg:text-sm font-semibold text-foreground">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCards.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    {t("cardNotFound")}
                  </td>
                </tr>
              ) : (
                filteredCards.map((card) => (
                  <tr
                    key={card.id}
                    className="border-b border-border/20 hover:bg-sidebar/10 transition-colors"
                  >
                    <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-mono font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <CreditCard size={14} className="text-blue-500 flex-shrink-0" />
                        <span className="truncate">{card.cardNumber}</span>
                      </div>
                    </td>
                    <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm font-bold text-cyan-500">
                      {formatBalance(card.balance)}
                    </td>
                    <td className="px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm">
                      <span className={`inline-flex items-center gap-1 px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${card.isActive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                        {card.isActive ? <Unlock size={12} /> : <Lock size={12} />}
                        <span className="hidden lg:inline">{card.isActive ? t("active") : t("inactive")}</span>
                      </span>
                    </td>
                    <td className="hidden lg:table-cell px-3 lg:px-6 py-3 lg:py-4 text-xs lg:text-sm text-muted-foreground">{card.createdAt}</td>
                    <td className="px-3 lg:px-6 py-3 lg:py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggleStatus(card.id)}
                          className={`p-1.5 lg:p-2 rounded-lg transition-colors ${card.isActive ? "hover:bg-red-500/10 text-red-500" : "hover:bg-green-500/10 text-green-500"}`}
                          title={card.isActive ? t("block") : t("unblock")}
                        >
                          {card.isActive ? <Lock size={16} /> : <Unlock size={16} />}
                        </button>
                        <button
                          onClick={() => handleEditCard(card)}
                          className="p-1.5 lg:p-2 hover:bg-blue-500/10 text-blue-500 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCard(card.id)}
                          className="p-1.5 lg:p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
