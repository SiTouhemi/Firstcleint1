"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, ImageIcon, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useApp } from "@/app/providers"
import { useToast } from "@/hooks/use-toast"

interface Banner {
  id: string
  title: string
  subtitle?: string
  description?: string
  image_url?: string
  background_color: string
  text_color: string
  button_text?: string
  button_link?: string
  is_active: boolean
  sort_order: number
  created_at: string
}

export function BannersManagement() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const { supabase } = useApp()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    image_url: "",
    background_color: "bg-gradient-to-r from-blue-600 to-blue-800",
    text_color: "text-white",
    button_text: "",
    button_link: "",
    sort_order: 0,
  })

  const backgroundOptions = [
    { value: "bg-gradient-to-r from-blue-600 to-blue-800", label: "أزرق متدرج", preview: "from-blue-600 to-blue-800" },
    {
      value: "bg-gradient-to-r from-green-600 to-green-800",
      label: "أخضر متدرج",
      preview: "from-green-600 to-green-800",
    },
    {
      value: "bg-gradient-to-r from-purple-600 to-purple-800",
      label: "بنفسجي متدرج",
      preview: "from-purple-600 to-purple-800",
    },
    { value: "bg-gradient-to-r from-red-600 to-red-800", label: "أحمر متدرج", preview: "from-red-600 to-red-800" },
    {
      value: "bg-gradient-to-r from-orange-600 to-orange-800",
      label: "برتقالي متدرج",
      preview: "from-orange-600 to-orange-800",
    },
    { value: "bg-gradient-to-r from-gray-600 to-gray-800", label: "رمادي متدرج", preview: "from-gray-600 to-gray-800" },
  ]

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase.from("banners").select("*").order("sort_order", { ascending: true })

      if (error) throw error
      setBanners(data || [])
    } catch (error) {
      console.error("Error fetching banners:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب البانرات",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى إدخال عنوان البانر",
        variant: "destructive",
      })
      return
    }

    try {
      const bannerData = {
        ...formData,
        subtitle: formData.subtitle || null,
        description: formData.description || null,
        image_url: formData.image_url || null,
        button_text: formData.button_text || null,
        button_link: formData.button_link || null,
      }

      if (editingBanner) {
        const { error } = await supabase.from("banners").update(bannerData).eq("id", editingBanner.id)
        if (error) throw error

        toast({
          title: "تم التحديث",
          description: "تم تحديث البانر بنجاح",
        })
      } else {
        const { error } = await supabase.from("banners").insert(bannerData)
        if (error) throw error

        toast({
          title: "تم الإنشاء",
          description: "تم إنشاء البانر بنجاح",
        })
      }

      setShowDialog(false)
      setEditingBanner(null)
      resetForm()
      fetchBanners()
    } catch (error) {
      console.error("Error saving banner:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الحفظ",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      description: banner.description || "",
      image_url: banner.image_url || "",
      background_color: banner.background_color,
      text_color: banner.text_color,
      button_text: banner.button_text || "",
      button_link: banner.button_link || "",
      sort_order: banner.sort_order,
    })
    setShowDialog(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف البانر؟")) return

    try {
      const { error } = await supabase.from("banners").delete().eq("id", id)
      if (error) throw error

      toast({
        title: "تم الحذف",
        description: "تم حذف البانر بنجاح",
      })
      fetchBanners()
    } catch (error) {
      console.error("Error deleting banner:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الحذف",
        variant: "destructive",
      })
    }
  }

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from("banners").update({ is_active: !currentStatus }).eq("id", id)
      if (error) throw error

      toast({
        title: "تم التحديث",
        description: `تم ${!currentStatus ? "تفعيل" : "إلغاء تفعيل"} البانر`,
      })
      fetchBanners()
    } catch (error) {
      console.error("Error updating banner status:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء التحديث",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      image_url: "",
      background_color: "bg-gradient-to-r from-blue-600 to-blue-800",
      text_color: "text-white",
      button_text: "",
      button_link: "",
      sort_order: banners.length,
    })
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
            <ImageIcon className="h-6 w-6" />
            إدارة البانرات
          </h1>
          <p className="text-gray-600 mt-1">إنشاء وإدارة بانرات الصفحة الرئيسية</p>
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingBanner(null)
                resetForm()
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              إضافة بانر جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingBanner ? "تعديل البانر" : "إضافة بانر جديد"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">العنوان الرئيسي</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="عنوان البانر"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">العنوان الفرعي</label>
                <Input
                  value={formData.subtitle}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="العنوان الفرعي (اختياري)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="وصف البانر (اختياري)"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رابط الصورة</label>
                <Input
                  value={formData.image_url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg (اختياري)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">لون الخلفية</label>
                <div className="grid grid-cols-2 gap-2">
                  {backgroundOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, background_color: option.value }))}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.background_color === option.value
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className={`h-8 w-full rounded bg-gradient-to-r ${option.preview} mb-2`}></div>
                      <span className="text-xs text-gray-600">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نص الزر</label>
                  <Input
                    value={formData.button_text}
                    onChange={(e) => setFormData((prev) => ({ ...prev, button_text: e.target.value }))}
                    placeholder="تسوق الآن (اختياري)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">رابط الزر</label>
                  <Input
                    value={formData.button_link}
                    onChange={(e) => setFormData((prev) => ({ ...prev, button_link: e.target.value }))}
                    placeholder="#"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ترتيب العرض</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.sort_order}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sort_order: Number(e.target.value) }))}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)} className="flex-1">
                  إلغاء
                </Button>
                <Button type="submit" className="flex-1">
                  {editingBanner ? "تحديث" : "إنشاء"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner) => (
          <Card key={banner.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{banner.title}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleStatus(banner.id, banner.is_active)}
                  >
                    {banner.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(banner)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(banner.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {/* Banner Preview */}
                <div
                  className={`${banner.background_color} ${banner.text_color} rounded-lg p-4 relative overflow-hidden`}
                >
                  {banner.image_url && (
                    <img
                      src={banner.image_url || "/placeholder.svg"}
                      alt={banner.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-20"
                    />
                  )}
                  <div className="relative z-10">
                    <h3 className="font-bold text-lg mb-1">{banner.title}</h3>
                    {banner.subtitle && <p className="text-sm opacity-90 mb-2">{banner.subtitle}</p>}
                    {banner.description && <p className="text-xs opacity-80 mb-3">{banner.description}</p>}
                    {banner.button_text && (
                      <button className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm font-medium transition-colors">
                        {banner.button_text}
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      banner.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {banner.is_active ? "نشط" : "غير نشط"}
                  </span>
                  <span className="text-gray-500">ترتيب: {banner.sort_order}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {banners.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد بانرات</h3>
          <p className="text-gray-600">ابدأ بإنشاء بانر جديد</p>
        </div>
      )}
    </div>
  )
}
