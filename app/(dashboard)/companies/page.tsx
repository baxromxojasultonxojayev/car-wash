"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit2, Trash2, Search, MapPin, X, ChevronDown, ChevronUp } from "lucide-react";
import CompanyForm from "@/components/companies/company-form";

interface BranchOffice {
  id: string;
  name: string;
  location: string;
}

interface Company {
  id: string;
  name: string;
  description?: string;
  ownerId?: string;
  branches: BranchOffice[];
  createdAt: string;
}

export default function CompaniesPage() {
  const { t } = useTranslation();

  const [companies, setCompanies] = useState<Company[]>([
    {
      id: "1",
      name: "CarWash Premium",
      description: "Tashkent shahrida eng yaxshi carwash xizmati",
      ownerId: "1",
      branches: [
        { id: "b1", name: "Mirzo Ulugbek", location: "Mirzo Ulugbek ko'chasi" },
        { id: "b2", name: "Yunus-Obod", location: "Yunus-Obod ko'chasi" },
      ],
      createdAt: "2024-01-01",
    },
    {
      id: "2",
      name: "Quick Clean",
      description: "Tezkor va sifatli xizmat",
      ownerId: "2",
      branches: [{ id: "b3", name: "Fergona", location: "Fergona shahar" }],
      createdAt: "2024-02-01",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null);

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCompany = (formData: Omit<Company, "id" | "createdAt">) => {
    const newCompany: Company = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setCompanies([...companies, newCompany]);
    setIsFormOpen(false);
  };

  const handleUpdateCompany = (formData: Omit<Company, "id" | "createdAt">) => {
    if (!editingCompany) return;
    const updatedCompanies = companies.map((company) =>
      company.id === editingCompany.id ? { ...company, ...formData } : company
    );
    setCompanies(updatedCompanies);
    setEditingCompany(null);
    setIsFormOpen(false);
  };

  const handleDeleteCompany = (id: string) => {
    if (confirm(t("deleteCompanyConfirm"))) {
      setCompanies(companies.filter((company) => company.id !== id));
    }
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setIsFormOpen(true);
  };

  const closeModal = () => {
    setIsFormOpen(false);
    setEditingCompany(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t("companies")}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("total")} {companies.length} ta
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCompany(null);
            setIsFormOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full sm:w-auto"
        >
          <Plus size={20} />
          {t("newCompany")}
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-card border border-border/20 p-3 sm:p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder={t("searchCompanyPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-input text-foreground border-border/30 text-sm"
          />
        </div>
      </Card>

      {/* Company Form Modal */}
      {isFormOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <Card
            className="w-full max-w-2xl bg-card border border-border/20 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                  {editingCompany ? t("editCompany") : t("newCompany")}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-muted-foreground hover:text-foreground p-1 hover:bg-accent rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <CompanyForm
                company={editingCompany}
                onSubmit={editingCompany ? handleUpdateCompany : handleAddCompany}
                onCancel={closeModal}
              />
            </div>
          </Card>
        </div>
      )}

      {/* Companies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {filteredCompanies.length === 0 ? (
          <div className="col-span-full text-center py-8 sm:py-12">
            <p className="text-muted-foreground">{t("companyNotFound")}</p>
          </div>
        ) : (
          filteredCompanies.map((company) => (
            <Card
              key={company.id}
              className="bg-card border border-border/20 overflow-hidden hover:border-blue-500/30 transition-colors"
            >
              <div className="p-4 sm:p-6">
                {/* Company Header */}
                <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">{company.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                      {company.description || t("noDescription")}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleEditCompany(company)}
                      className="p-1.5 sm:p-2 hover:bg-blue-500/10 text-blue-500 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteCompany(company.id)}
                      className="p-1.5 sm:p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="text-[10px] sm:text-xs text-muted-foreground mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-border/20">
                  {t("createdAt")}: {company.createdAt}
                </div>

                {/* Branches */}
                <div>
                  <button
                    onClick={() =>
                      setExpandedCompany(expandedCompany === company.id ? null : company.id)
                    }
                    className="w-full text-left flex items-center justify-between gap-2 text-xs sm:text-sm font-medium text-foreground hover:text-blue-500 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="sm:w-4 sm:h-4" />
                      <span>{company.branches.length} ta {t("branch")}</span>
                    </div>
                    {expandedCompany === company.id ? (
                      <ChevronUp size={14} className="sm:w-4 sm:h-4" />
                    ) : (
                      <ChevronDown size={14} className="sm:w-4 sm:h-4" />
                    )}
                  </button>

                  {expandedCompany === company.id && (
                    <div className="space-y-2 mt-3 pl-4 sm:pl-6 border-l border-border/20">
                      {company.branches.map((branch) => (
                        <div key={branch.id} className="text-xs sm:text-sm">
                          <p className="font-medium text-foreground">{branch.name}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">{branch.location}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
