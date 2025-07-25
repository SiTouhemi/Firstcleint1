"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Tags, ChevronRight, FolderOpen, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: string
  store_id: string
  name: string
  description?: string
  icon?: string
  parent_id?: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  subcategories?: Category[]
}

export function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [selectedParent, setSelectedParent] = useState<string>("")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    parent_id: "",
    sort_order: 0,
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()

      if (data.success) {
        setCategories(data.data)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب الفئات",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/[^\w\u0600-\u06FF-]+/g, '') // Remove non-word chars except Arabic and hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with one
      .replace(/^-+|-+$/g, ''); // Trim hyphens from start/end
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى إدخال اسم الفئة",
        variant: "destructive",
      })
      return
    }

    try {
      const slug = generateSlug(formData.name)
      const categoryData = {
        ...formData,
        slug, // Add slug to payload
        parent_id: formData.parent_id || null,
        description: formData.description || null,
        icon: formData.icon || null,
      }

      const url = editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories"
      const method = editingCategory ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: editingCategory ? "تم التحديث" : "تم الإنشاء",
          description: editingCategory ? "تم تحديث الفئة بنجاح" : "تم إنشاء الفئة بنجاح",
        })
        setShowDialog(false)
        setEditingCategory(null)
        resetForm()
        fetchCategories()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error saving category:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الحفظ",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
      icon: category.icon || "",
      parent_id: category.parent_id || "",
      sort_order: category.sort_order,
    })
    setShowDialog(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف الفئة؟ سيتم حذف جميع الفئات الفرعية أيضاً.")) return

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "تم الحذف",
          description: "تم حذف الفئة بنجاح",
        })
        fetchCategories()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الحذف",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      icon: "",
      parent_id: "",
      sort_order: categories.length,
    })
  }

  const mainCategories = categories.filter((cat) => !cat.parent_id)
  const getSubcategories = (parentId: string) => categories.filter((cat) => cat.parent_id === parentId)

  const iconOptions = [
    "📱",
    "💻",
    "👕",
    "👗",
    "🏠",
    "🍳",
    "⚽",
    "🏃‍♂️",
    "💄",
    "🧴",
    "📚",
    "🎮",
    "🚗",
    "🛵",
    "🎵",
    "📷",
    "⌚",
    "👟",
    "🎒",
    "🧸",
    "🌱",
    "🍕",
    "☕",
    "🍰",
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Tags className="h-8 w-8 text-blue-600" />
            إدارة الفئات
          </h1>
          <p className="text-gray-600 mt-2">إنشاء وإدارة فئات المنتجات والفئات الفرعية</p>
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingCategory(null)
                resetForm()
              }}
              className="flex items-center gap-2 px-6 py-3"
              size="lg"
            >
              <Plus className="h-5 w-5" />
              إضافة فئة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <DialogHeader>
              <DialogTitle className="text-xl">{editingCategory ? "تعديل الفئة" : "إضافة فئة جديدة"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الفئة <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="اسم الفئة"
                  required
                  className="h-12"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="وصف الفئة (اختياري)"
                  rows={3}
                />
              </div>

              {/* --- CATEGORY MANAGEMENT FORM --- */}
              {/* Updated: clarified main/subcategory logic, icon handling (emoji or URL), and added comments for clarity. */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الفئة الرئيسية</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-md h-12"
                  value={formData.parent_id}
                  onChange={(e) => setFormData((prev) => ({ ...prev, parent_id: e.target.value }))}
                >
                  <option value="">فئة رئيسية (بدون أب)</option>
                  {mainCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  اختر فئة رئيسية إذا كنت تريد إنشاء فئة فرعية. اتركها فارغة لإنشاء فئة رئيسية.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الأيقونة</label>
                <div className="grid grid-cols-8 gap-2 p-4 border border-gray-200 rounded-lg max-h-32 overflow-y-auto">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, icon }))}
                      className={`p-2 text-2xl rounded-lg border-2 transition-all hover:scale-110 ${
                        formData.icon === icon ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                <Input
                  value={formData.icon}
                  onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                  placeholder="أو أدخل رمز/رابط أيقونة مخصص (مثال: https://...)"
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  يمكنك اختيار رمز من الأعلى أو إدخال رمز/رابط أيقونة مخصص (يفضل رمز إيموجي أو رابط صورة صغير).
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ترتيب العرض</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.sort_order}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sort_order: Number.parseInt(e.target.value) }))}
                  className="h-12"
                />
              </div>

              <div className="flex gap-3 pt-6 border-t">
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)} className="flex-1 h-12">
                  إلغاء
                </Button>
                <Button type="submit" className="flex-1 h-12">
                  {editingCategory ? "تحديث الفئة" : "إنشاء الفئة"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid - Compact and Beautiful */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mainCategories.map((category, idx) => {
          const gradients = [
            'linear-gradient(135deg, rgb(227, 242, 253) 0%, rgb(187, 222, 251) 100%)', // blue
            'linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 100%)', // green
            'linear-gradient(135deg, #fff3e0 0%, #ffcc80 100%)', // orange
            'linear-gradient(135deg, #f3e5f5 0%, #ce93d8 100%)', // purple
            'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)', // pink
            'linear-gradient(135deg, #e1f5fe 0%, #81d4fa 100%)', // light blue
          ];
          const background = gradients[idx % gradients.length];
          const subcategories = getSubcategories(category.id)
          return (
            <Card key={category.id} className="hover:shadow-lg transition-shadow duration-300 border-0 relative overflow-visible p-3 min-h-[180px] max-w-xs mx-auto"
              style={{
                background,
                color: '#1a1a1a',
                fontFamily: 'Noto Sans Arabic, system-ui, -apple-system, sans-serif',
              }}
            >
              <CardHeader className="pb-1 flex flex-col gap-1 p-0">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-white/80 rounded-lg shadow">
                    <span className="text-xl">
                      {category.icon || <FolderOpen className="h-5 w-5 text-blue-600" />}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base text-gray-900 truncate">{category.name}</CardTitle>
                    {category.description && <p className="text-xs text-gray-600 mt-0.5 truncate">{category.description}</p>}
                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                        {subcategories.length} فئة فرعية
                      </span>
                      <span className="text-[10px] text-gray-500">ترتيب: {category.sort_order}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{category.is_active ? 'نشطة' : 'غير نشطة'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 mt-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(category)}>
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full text-xs py-1"
                  onClick={() => {
                    setEditingCategory(null);
                    setFormData({
                      name: "",
                      description: "",
                      icon: "",
                      parent_id: category.id,
                      sort_order: categories.length,
                    });
                    setShowDialog(true);
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  إضافة فئة فرعية
                </Button>
              </CardHeader>
              {subcategories.length > 0 && (
                <CardContent className="pt-0">
                  <div className="border-t pt-2 mt-2">
                    <h4 className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" />
                      الفئات الفرعية
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {subcategories.map((subcategory, subIdx) => {
                        const subBackground = gradients[subIdx % gradients.length];
                        return (
                          <div
                            key={subcategory.id}
                            className="flex flex-col items-center justify-center p-2 rounded-lg shadow border min-w-[80px] bg-white/80"
                            style={{
                              background: subBackground,
                              color: '#1a1a1a',
                            }}
                          >
                            <span className="text-base mb-0.5">
                              {subcategory.icon || <Folder className="h-3 w-3 text-gray-400" />}
                            </span>
                            <span className="text-[11px] font-medium text-gray-900 truncate">{subcategory.name}</span>
                            <span className={`text-[10px] px-1 py-0.5 rounded-full mt-1 ${subcategory.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{subcategory.is_active ? 'نشطة' : 'غير نشطة'}</span>
                            <div className="flex gap-1 mt-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5"
                                onClick={() => handleEdit(subcategory)}
                              >
                                <Edit className="h-2.5 w-2.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 text-red-600 hover:text-red-700"
                                onClick={() => handleDelete(subcategory.id)}
                              >
                                <Trash2 className="h-2.5 w-2.5" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-16">
          <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <Tags className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد فئات</h3>
          <p className="text-gray-600 mb-6">ابدأ بإنشاء فئات لتنظيم منتجاتك</p>
          <Button onClick={() => setShowDialog(true)} className="px-6 py-3">
            <Plus className="h-4 w-4 mr-2" />
            إضافة فئة جديدة
          </Button>
        </div>
      )}
    </div>
  )
}
