"use client"

import { useState } from "react"
import { Settings, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export function StoreSettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    name: "المتجر الإلكتروني",
    email: "store@example.com",
    phone: "+966 XX XXX XXXX",
    currency: "SAR",
    address: "الرياض، المملكة العربية السعودية",
    description: "متجر إلكتروني متكامل يوفر منتجات عالية الجودة",
  })

  const handleSave = () => {
    // Here you would typically save to database
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم حفظ إعدادات المتجر بنجاح",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="h-6 w-6" />
          إعدادات المتجر
        </h1>
        <p className="text-gray-600 mt-1">إدارة البيانات العامة للمتجر</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>معلومات المتجر</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">اسم المتجر</label>
              <Input
                value={settings.name}
                onChange={(e) => setSettings((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="أدخل اسم المتجر"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
              <Input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="store@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
              <Input
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="+966 XX XXX XXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">العملة</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={settings.currency}
                onChange={(e) => setSettings((prev) => ({ ...prev, currency: e.target.value }))}
              >
                <option value="SAR">ريال سعودي (SAR)</option>
                <option value="USD">دولار أمريكي (USD)</option>
                <option value="EUR">يورو (EUR)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">عنوان المتجر</label>
            <Textarea
              value={settings.address}
              onChange={(e) => setSettings((prev) => ({ ...prev, address: e.target.value }))}
              placeholder="أدخل عنوان المتجر الكامل"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">وصف المتجر</label>
            <Textarea
              value={settings.description}
              onChange={(e) => setSettings((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="وصف مختصر عن المتجر ونشاطه"
              rows={4}
            />
          </div>

          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            حفظ التغييرات
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
