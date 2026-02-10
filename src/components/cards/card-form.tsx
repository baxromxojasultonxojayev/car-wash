"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface RFIDCardFormData {
  cardNumber: string
  balance: number
  isActive: boolean
  companyId?: string
  ownerId?: string
}

interface RFIDCard extends RFIDCardFormData {
  id: string
  createdAt: string
}

interface CardFormProps {
  card?: RFIDCard | null
  onSubmit: (data: RFIDCardFormData) => void
  onCancel: () => void
}

export default function CardForm({ card, onSubmit, onCancel }: CardFormProps) {
  const [formData, setFormData] = useState<RFIDCardFormData>({
    cardNumber: "",
    balance: 0,
    isActive: true,
    companyId: "1",
    ownerId: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (card) {
      setFormData({
        cardNumber: card.cardNumber,
        balance: card.balance,
        isActive: card.isActive,
        companyId: card.companyId || "1",
        ownerId: card.ownerId || "",
      })
    }
  }, [card])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.cardNumber) {
      newErrors.cardNumber = "Karta raqami talab qilinadi"
    } else if (!/^[0-9A-Fa-f]{12}$/.test(formData.cardNumber)) {
      newErrors.cardNumber = "Karta raqami 12 ta hexadecimal raqamdan iborat bo'lishi kerak"
    }

    if (formData.balance < 0) {
      newErrors.balance = "Balans manfiy bo'lishi mumkin emas"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Karta Raqami</label>
        <Input
          value={formData.cardNumber}
          onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value.toUpperCase() })}
          className="bg-input text-foreground border-border/30 font-mono"
          placeholder="1234567890AB"
          maxLength={12}
        />
        {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
        <p className="text-xs text-muted-foreground mt-1">12 ta hexadecimal raqam</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Balans (so'mda)</label>
        <Input
          type="number"
          value={formData.balance}
          onChange={(e) => setFormData({ ...formData, balance: Number.parseInt(e.target.value) || 0 })}
          className="bg-input text-foreground border-border/30"
          placeholder="0"
          min="0"
        />
        {errors.balance && <p className="text-red-500 text-xs mt-1">{errors.balance}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Kompaniya</label>
        <select
          value={formData.companyId}
          onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
          className="w-full px-3 py-2 bg-input text-foreground border border-border/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="1">CarWash Premium</option>
          <option value="2">Quick Clean</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Foydalanuvchi (ixtiyoriy)</label>
        <Input
          value={formData.ownerId}
          onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
          className="bg-input text-foreground border-border/30"
          placeholder="Foydalanuvchi ID"
        />
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4 rounded border-border/30 bg-input"
          />
          <span className="text-sm font-medium text-foreground">Faol</span>
        </label>
      </div>

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
