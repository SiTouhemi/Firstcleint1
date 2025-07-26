"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Copy, Tag, Percent, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface PromoCode {
  id: string
  code: string
  description: string
  discount_type: "percentage" | "fixed"
  discount_value: number
  min_order_amount: number
  max_discount_amount?: number
  usage_limit?: number
  used_count: number
  is_active: boolean
  valid_from: string
  valid_until?: string
  created_at: string
}

export function PromoCodesManagement() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discount_type: "percentage" as "percentage" | "fixed",
    discount_value: 0,
    min_order_amount: 0,
    max_discount_amount: 0,
    usage_limit: 0,
    valid_from: "",
    valid_until: "",
  })

  useEffect(() => {
    fetchPromoCodes()
  }, [])

  const fetchPromoCodes = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/promo-codes")
      const result = await response.json()
      if (result.success) {
        setPromoCodes(result.data || [])
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error fetching promo codes:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب أكواد الخصم",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.code.trim() || !formData.description.trim() || formData.discount_value <= 0) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      })
      return
    }
    try {
      const promoData = {
        ...formData,
        code: formData.code.toUpperCase(),
        max_discount_amount: formData.max_discount_amount || null,
        usage_limit: formData.usage_limit || null,
        valid_until: formData.valid_until || null,
      }
      let response, result
      if (editingCode) {
        response = await fetch("/api/promo-codes", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingCode.id, ...promoData })
        })
        result = await response.json()
        if (result.success) {
          toast({ title: "تم التحديث", description: "تم تحديث كود الخصم بنجاح" })
        } else {
          throw new Error(result.error)
        }
      } else {
        response = await fetch("/api/promo-codes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(promoData)
        })
        result = await response.json()
        if (result.success) {
          toast({ title: "تم الإنشاء", description: "تم إنشاء كود الخصم بنجاح" })
        } else {
          throw new Error(result.error)
        }
      }
      setShowDialog(false)
      setEditingCode(null)
      resetForm()
      fetchPromoCodes()
    } catch (error: any) {
      console.error("Error saving promo code:", error)
      toast({
        title: "خطأ",
        description: error.message?.includes("duplicate") ? "كود الخصم موجود مسبقاً" : "حدث خطأ أثناء الحفظ",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (promoCode: PromoCode) => {
    setEditingCode(promoCode)
    setFormData({
      code: promoCode.code,
      description: promoCode.description,
      discount_type: promoCode.discount_type,
      discount_value: promoCode.discount_value,
      min_order_amount: promoCode.min_order_amount,
      max_discount_amount: promoCode.max_discount_amount || 0,
      usage_limit: promoCode.usage_limit || 0,
      valid_from: promoCode.valid_from ? promoCode.valid_from.split("T")[0] : "",
      valid_until: promoCode.valid_until ? promoCode.valid_until.split("T")[0] : "",
    })
    setShowDialog(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف كود الخصم؟")) return
    try {
      const response = await fetch("/api/promo-codes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      })
      const result = await response.json()
      if (result.success) {
        toast({ title: "تم الحذف", description: "تم حذف كود الخصم بنجاح" })
        fetchPromoCodes()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error deleting promo code:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الحذف",
        variant: "destructive",
      })
    }
  }

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/promo-codes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_active: !currentStatus })
      })
      const result = await response.json()
      if (result.success) {
        toast({ title: "تم التحديث", description: `تم ${!currentStatus ? "تفعيل" : "إلغاء تفعيل"} كود الخصم` })
        fetchPromoCodes()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error updating promo code status:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء التحديث",
        variant: "destructive",
      })
    }
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "تم النسخ",
      description: `تم نسخ الكود: ${code}`,
    })
  }

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discount_type: "percentage",
      discount_value: 0,
      min_order_amount: 0,
      max_discount_amount: 0,
      usage_limit: 0,
      valid_from: "",
      valid_until: "",
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA")
  }

  const isExpired = (endDate?: string) => {
    if (!endDate) return false
    return new Date(endDate) < new Date()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Tag className="h-6 w-6" />
            إدارة أكواد الخصم
          </h1>
          <p className="text-gray-600 mt-1">إنشاء وإدارة أكواد الخصم والعروض الترويجية</p>
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingCode(null)
                resetForm()
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              إضافة كود خصم
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCode ? "تعديل كود الخصم" : "إضافة كود خصم جديد"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">كود الخصم</label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="SAVE20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="وصف كود الخصم"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نوع الخصم</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={formData.discount_type}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, discount_type: e.target.value as "percentage" | "fixed" }))
                    }
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="fixed">مبلغ ثابت (ر.س)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">قيمة الخصم</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discount_value}
                    onChange={(e) => setFormData((prev) => ({ ...prev, discount_value: Number(e.target.value) }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">أقل مبلغ للطلب</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.min_order_amount}
                    onChange={(e) => setFormData((prev) => ({ ...prev, min_order_amount: Number(e.target.value) }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">أقصى خصم (اختياري)</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.max_discount_amount}
                    onChange={(e) => setFormData((prev) => ({ ...prev, max_discount_amount: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">حد الاستخدام (اختياري)</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.usage_limit}
                  onChange={(e) => setFormData((prev) => ({ ...prev, usage_limit: Number(e.target.value) }))}
                  placeholder="0 = بلا حدود"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ البداية</label>
                  <Input
                    type="date"
                    value={formData.valid_from}
                    onChange={(e) => setFormData((prev) => ({ ...prev, valid_from: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الانتهاء (اختياري)</label>
                  <Input
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData((prev) => ({ ...prev, valid_until: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)} className="flex-1">
                  إلغاء
                </Button>
                <Button type="submit" className="flex-1">
                  {editingCode ? "تحديث" : "إنشاء"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Promo Codes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promoCodes.map((promoCode) => (
          <Card key={promoCode.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-2 rounded-full ${promoCode.discount_type === "percentage" ? "bg-blue-100" : "bg-green-100"}`}
                  >
                    {promoCode.discount_type === "percentage" ? (
                      <Percent
                        className={`h-4 w-4 ${promoCode.discount_type === "percentage" ? "text-blue-600" : "text-green-600"}`}
                      />
                    ) : (
                      <DollarSign className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {promoCode.code}
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyCode(promoCode.code)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </CardTitle>
                    <p className="text-sm text-gray-600">{promoCode.description}</p>
                  </div>
                </div>

                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(promoCode)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(promoCode.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">قيمة الخصم:</span>
                  <span className="font-medium text-blue-600">
                    {promoCode.discount_value}
                    {promoCode.discount_type === "percentage" ? "%" : " ر.س"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">أقل مبلغ:</span>
                  <span className="font-medium">{promoCode.min_order_amount} ر.س</span>
                </div>

                {promoCode.usage_limit && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">الاستخدام:</span>
                    <span className="font-medium">
                      {promoCode.used_count} / {promoCode.usage_limit}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">صالح حتى:</span>
                  <span className="font-medium text-sm">
                    {promoCode.valid_until ? formatDate(promoCode.valid_until) : "بلا انتهاء"}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        promoCode.is_active && !isExpired(promoCode.valid_until)
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {promoCode.is_active && !isExpired(promoCode.valid_until) ? "نشط" : "غير نشط"}
                    </span>
                    {isExpired(promoCode.valid_until) && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        منتهي الصلاحية
                      </span>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleStatus(promoCode.id, promoCode.is_active)}
                    disabled={isExpired(promoCode.valid_until)}
                  >
                    {promoCode.is_active ? "إلغاء التفعيل" : "تفعيل"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {promoCodes.length === 0 && (
        <div className="text-center py-12">
          <Tag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد أكواد خصم</h3>
          <p className="text-gray-600">ابدأ بإنشاء كود خصم جديد</p>
        </div>
      )}
    </div>
  )
}
