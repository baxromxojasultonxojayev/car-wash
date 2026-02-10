"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type KioskStatus = "free" | "payment" | "active" | "pause" | "finish" | "error" | "closed"

interface KioskFormData {
  name: string
  status: KioskStatus
  isActive: boolean
  controllerMacAddress: string
  companyId: string
  branchOfficeId: string
  patternId?: string
}

interface Kiosk extends KioskFormData {
  id: string
  createdAt: string
}

interface KioskFormProps {
  kiosk?: Kiosk | null
  onSubmit: (data: KioskFormData) => void
  onCancel: () => void
}

export default function KioskForm({ kiosk, onSubmit, onCancel }: KioskFormProps) {
  const [formData, setFormData] = useState<KioskFormData>({
    name: "",
    status: "free",
    isActive: true,
    controllerMacAddress: "",
    companyId: "1",
    branchOfficeId: "b1",
    patternId: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (kiosk) {
      setFormData({
        name: kiosk.name,
        status: kiosk.status,
        isActive: kiosk.isActive,
        controllerMacAddress: kiosk.controllerMacAddress,
        companyId: kiosk.companyId,
        branchOfficeId: kiosk.branchOfficeId,
        patternId: kiosk.patternId || "",
      })
    }
  }, [kiosk])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name) {
      newErrors.name = "Kiosk nomi talab qilinadi"
    }

    if (!formData.controllerMacAddress) {
      newErrors.controllerMacAddress = "MAC address talab qilinadi"
    } else if (!/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(formData.controllerMacAddress)) {
      newErrors.controllerMacAddress = "MAC address noto'g'ri formatda"
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
        <label className="block text-sm font-medium text-foreground mb-2">Kiosk Nomi</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="bg-input text-foreground border-border/30"
          placeholder="Kiosk nomi"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as KioskStatus })}
          className="w-full px-3 py-2 bg-input text-foreground border border-border/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="free">Bo'sh</option>
          <option value="payment">To'lov jarayoni</option>
          <option value="active">Faol</option>
          <option value="pause">To'xtatilgan</option>
          <option value="finish">Tugallangan</option>
          <option value="error">Xato</option>
          <option value="closed">Yopilgan</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">MAC Address</label>
        <Input
          value={formData.controllerMacAddress}
          onChange={(e) => setFormData({ ...formData, controllerMacAddress: e.target.value })}
          className="bg-input text-foreground border-border/30"
          placeholder="00:1A:2B:3C:4D:5E"
        />
        {errors.controllerMacAddress && <p className="text-red-500 text-xs mt-1">{errors.controllerMacAddress}</p>}
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
        <label className="block text-sm font-medium text-foreground mb-2">Filial</label>
        <select
          value={formData.branchOfficeId}
          onChange={(e) => setFormData({ ...formData, branchOfficeId: e.target.value })}
          className="w-full px-3 py-2 bg-input text-foreground border border-border/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="b1">Mirzo Ulugbek</option>
          <option value="b2">Yunus-Obod</option>
          <option value="b3">Fergona</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4 rounded border-border/30 bg-input"
          />
          <span className="text-sm font-medium text-foreground">Aktiv</span>
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
