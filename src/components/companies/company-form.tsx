"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface BranchOffice {
  id: string
  name: string
  location: string
}

interface CompanyFormData {
  name: string
  description?: string
  ownerId?: string
  branches: BranchOffice[]
}

interface Company extends CompanyFormData {
  id: string
  createdAt: string
}

interface CompanyFormProps {
  company?: Company | null
  onSubmit: (data: CompanyFormData) => void
  onCancel: () => void
}

export default function CompanyForm({ company, onSubmit, onCancel }: CompanyFormProps) {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: "",
    description: "",
    ownerId: "",
    branches: [],
  })
  const [newBranch, setNewBranch] = useState({ name: "", location: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        description: company.description || "",
        ownerId: company.ownerId || "",
        branches: company.branches,
      })
    }
  }, [company])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name) {
      newErrors.name = "Kompaniya nomi talab qilinadi"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddBranch = () => {
    if (newBranch.name && newBranch.location) {
      const branch: BranchOffice = {
        id: Date.now().toString(),
        name: newBranch.name,
        location: newBranch.location,
      }
      setFormData({
        ...formData,
        branches: [...formData.branches, branch],
      })
      setNewBranch({ name: "", location: "" })
    }
  }

  const handleRemoveBranch = (id: string) => {
    setFormData({
      ...formData,
      branches: formData.branches.filter((b) => b.id !== id),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Company Info */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Kompaniya Nomi</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="bg-input text-foreground border-border/30"
          placeholder="Kompaniya nomi"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Tavsif</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 bg-input text-foreground border border-border/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Kompaniya haqida ma'lumot"
          rows={3}
        />
      </div>

      {/* Branches Section */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-4">Filiallar</h3>

        {/* Add Branch Form */}
        <div className="space-y-3 mb-4 p-4 bg-sidebar/20 rounded-lg border border-border/20">
          <Input
            value={newBranch.name}
            onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
            className="bg-input text-foreground border-border/30"
            placeholder="Filial nomi"
          />
          <Input
            value={newBranch.location}
            onChange={(e) => setNewBranch({ ...newBranch, location: e.target.value })}
            className="bg-input text-foreground border-border/30"
            placeholder="Lokatsiya"
          />
          <Button type="button" onClick={handleAddBranch} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Filial Qo'shish
          </Button>
        </div>

        {/* Branches List */}
        {formData.branches.length > 0 && (
          <div className="space-y-2">
            {formData.branches.map((branch) => (
              <div
                key={branch.id}
                className="flex items-start justify-between p-3 bg-sidebar/20 border border-border/20 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{branch.name}</p>
                  <p className="text-xs text-muted-foreground">{branch.location}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveBranch(branch.id)}
                  className="p-1 hover:bg-red-500/10 text-red-500 rounded transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-border/20">
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
          Saqlash
        </Button>
        <Button type="button" onClick={onCancel} className="flex-1 bg-sidebar hover:bg-sidebar/80 text-foreground">
          Bekor qilish
        </Button>
      </div>
    </form>
  )
}
