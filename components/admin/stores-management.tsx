"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, StoreIcon, MapPin, Phone, Mail, Globe, Eye, BarChart3, Search, Navigation, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { AdminLocationPicker } from "./location-picker"

interface Store {
  id: string
  name: string
  description?: string
  email?: string
  phone?: string
  whatsapp?: string
  website?: string
  address: string
  location_lat?: number
  location_lng?: number
  delivery_range: number
  delivery_fee: number
  min_order_amount: number
  theme_color: string
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
  slug: string
  city_id: string
}

export function StoresManagement() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingStore, setEditingStore] = useState<Store | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  // Add cities state
  const [cities, setCities] = useState<any[]>([])

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    city_id: "",
    description: "",
    email: "",
    phone: "",
    whatsapp: "",
    website: "",
    address: "",
    location_lat: 0,
    location_lng: 0,
    delivery_range: 10,
    delivery_fee: 0,
    min_order_amount: 0,
    theme_color: "#3B82F6",
  })

  // Fetch cities on mount
  useEffect(() => {
    fetchCities()
    fetchStores()
  }, [])

  const fetchCities = async () => {
    try {
      const response = await fetch("/api/cities")
      const data = await response.json()
      if (data.success) {
        setCities(data.data.filter((c: any) => c.is_active))
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({ title: "خطأ", description: "حدث خطأ أثناء جلب المدن", variant: "destructive" })
    }
  }

  const fetchStores = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/stores")
      const data = await response.json()

      if (data.success) {
        setStores(data.data)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error fetching stores:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب المتاجر",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.address.trim() || !formData.city_id.trim() || !formData.slug.trim()) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى ملء جميع الحقول المطلوبة (اسم المتجر، المعرف، المدينة، العنوان)",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)

      const url = editingStore ? `/api/stores/${editingStore.id}` : "/api/stores"
      const method = editingStore ? "PUT" : "POST"

      // Convert empty strings to null for all fields
      const cleanedFormData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          value === "" ? null : value
        ])
      )

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedFormData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: editingStore ? "تم التحديث" : "تم الإنشاء",
          description: editingStore ? "تم تحديث المتجر بنجاح" : "تم إنشاء المتجر بنجاح",
        })
        setShowDialog(false)
        setEditingStore(null)
        resetForm()
        fetchStores()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error saving store:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الحفظ",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (store: Store) => {
    setEditingStore(store)
    setFormData({
      name: store.name,
      slug: store.slug || "",
      city_id: store.city_id || "",
      description: store.description || "",
      email: store.email || "",
      phone: store.phone || "",
      whatsapp: store.whatsapp || "",
      website: store.website || "",
      address: store.address,
      location_lat: store.location_lat || 0,
      location_lng: store.location_lng || 0,
      delivery_range: store.delivery_range,
      delivery_fee: store.delivery_fee,
      min_order_amount: store.min_order_amount,
      theme_color: store.theme_color,
    })
    setShowDialog(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف المتجر؟ سيتم إلغاء تفعيله فقط.")) return

    try {
      const response = await fetch(`/api/stores/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "تم الحذف",
          description: "تم إلغاء تفعيل المتجر بنجاح",
        })
        fetchStores()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error deleting store:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الحذف",
        variant: "destructive",
      })
    }
  }

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setFormData((prev) => ({
      ...prev,
      address: location.address,
      location_lat: location.lat,
      location_lng: location.lng,
    }))
  }

  const toggleStoreStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/stores/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "تم التحديث",
          description: `تم ${!currentStatus ? "تفعيل" : "إلغاء تفعيل"} المتجر`,
        })
        fetchStores()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Error updating store status:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء التحديث",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      city_id: "",
      description: "",
      email: "",
      phone: "",
      whatsapp: "",
      website: "",
      address: "",
      location_lat: 0,
      location_lng: 0,
      delivery_range: 10,
      delivery_fee: 0,
      min_order_amount: 0,
      theme_color: "#3B82F6",
    })
  }

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (store.description && store.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <StoreIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
            إدارة المتاجر
          </h1>
          <p className="text-gray-600 mt-2">إنشاء وإدارة المتاجر الإلكترونية وفروعها</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="البحث في المتاجر..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 w-full"
            />
          </div>

          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingStore(null)
                  resetForm()
                }}
                className="flex items-center gap-2 px-4 sm:px-6 py-3 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                size="lg"
              >
                <Plus className="h-5 w-5" />
                <span className="text-sm sm:text-base">إضافة متجر جديد</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-auto">
              <DialogHeader>
                <DialogTitle className="text-xl text-right">
                  {editingStore ? "تعديل المتجر" : "إضافة متجر جديد"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      اسم المتجر <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          name,
                          slug: name
                            .toLowerCase()
                            .replace(/\s+/g, '-')
                            .replace(/[^a-z0-9\u0600-\u06FF-]+/g, '-') // allow Arabic, replace other non-alphanum with dash
                            .replace(/-+/g, '-')
                            .replace(/^-|-$/g, '')
                        }));
                      }}
                      placeholder="اسم المتجر"
                      required
                      className="h-12"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">المدينة <span className="text-red-500">*</span></label>
                    <select
                      value={formData.city_id}
                      onChange={e => setFormData(prev => ({ ...prev, city_id: e.target.value }))}
                      required
                      className="h-12 w-full border rounded px-3"
                    >
                      <option value="">اختر مدينة</option>
                      {cities.map(city => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">لون المتجر</label>
                    <Input
                      type="color"
                      value={formData.theme_color}
                      onChange={(e) => setFormData((prev) => ({ ...prev, theme_color: e.target.value }))}
                      className="h-12 w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">وصف المتجر</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="وصف مختصر عن المتجر وما يقدمه"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="store@example.com"
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="+966501234567"
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رقم الواتساب</label>
                    <Input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData((prev) => ({ ...prev, whatsapp: e.target.value }))}
                      placeholder="+966501234567"
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الموقع الإلكتروني</label>
                    <Input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                      placeholder="https://store.com"
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      نطاق التوصيل (كم) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.delivery_range}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, delivery_range: Number.parseInt(e.target.value) }))
                      }
                      required
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رسوم التوصيل (ر.س)</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.delivery_fee}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, delivery_fee: Number.parseFloat(e.target.value) }))
                      }
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">أقل مبلغ للطلب (ر.س)</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.min_order_amount}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, min_order_amount: Number.parseFloat(e.target.value) }))
                      }
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">خط العرض (Latitude)</label>
                    <Input value={formData.location_lat} readOnly className="h-12" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">خط الطول (Longitude)</label>
                    <Input value={formData.location_lng} readOnly className="h-12" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    موقع المتجر <span className="text-red-500">*</span>
                  </label>
                  <AdminLocationPicker
                    onLocationSelect={handleLocationSelect}
                    initialLocation={
                      formData.location_lat && formData.location_lng
                        ? {
                            lat: formData.location_lat,
                            lng: formData.location_lng,
                            address: formData.address,
                          }
                        : undefined
                    }
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowDialog(false)}
                    className="flex-1 h-12"
                    disabled={submitting}
                  >
                    إلغاء
                  </Button>
                  <Button type="submit" className="flex-1 h-12 bg-blue-600 hover:bg-blue-700" disabled={submitting}>
                    {submitting ? "جاري الحفظ..." : editingStore ? "تحديث المتجر" : "إنشاء المتجر"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards - Mobile Optimized */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm sm:text-base">إجمالي المتاجر</p>
                <p className="text-2xl sm:text-3xl font-bold">{stores.length}</p>
              </div>
              <StoreIcon className="h-8 w-8 sm:h-12 sm:w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm sm:text-base">المتاجر النشطة</p>
                <p className="text-2xl sm:text-3xl font-bold">{stores.filter((s) => s.is_active).length}</p>
              </div>
              <Eye className="h-8 w-8 sm:h-12 sm:w-12 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm sm:text-base">المتاجر المميزة</p>
                <p className="text-2xl sm:text-3xl font-bold">{stores.filter((s) => s.is_featured).length}</p>
              </div>
              <BarChart3 className="h-8 w-8 sm:h-12 sm:w-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm sm:text-base">متوسط نطاق التوصيل</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {stores.length > 0
                    ? Math.round(stores.reduce((sum, s) => sum + s.delivery_range, 0) / stores.length)
                    : 0}{" "}
                  كم
                </p>
              </div>
              <MapPin className="h-8 w-8 sm:h-12 sm:w-12 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stores Grid - Mobile Optimized */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredStores.map((store) => (
          <Card
            key={store.id}
            className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg"
          >
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: `${store.theme_color}20` }}>
                    <StoreIcon className="h-6 w-6" style={{ color: store.theme_color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg text-gray-900 truncate">{store.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant={store.is_active ? "default" : "secondary"} className="text-xs">
                        {store.is_active ? "نشط" : "غير نشط"}
                      </Badge>
                      {store.is_featured && (
                        <Badge variant="outline" className="text-xs border-yellow-400 text-yellow-600">
                          مميز
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(store)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(store.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {store.description && <p className="text-sm text-gray-600 line-clamp-2">{store.description}</p>}

                {store.email && (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{store.email}</span>
                  </div>
                )}

                {store.phone && (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span>{store.phone}</span>
                  </div>
                )}

                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{store.address}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Globe className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <span>{store.delivery_range} كم</span>
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium">{store.delivery_fee} ر.س</span>
                    <span className="text-xs"> توصيل</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t">
                  <span className="text-xs text-gray-500">
                    {new Date(store.created_at).toLocaleDateString("ar-SA")}
                  </span>
                  <Button
                    variant={store.is_active ? "outline" : "default"}
                    size="sm"
                    onClick={() => toggleStoreStatus(store.id, store.is_active)}
                    className={store.is_active ? "" : "bg-green-600 hover:bg-green-700"}
                  >
                    {store.is_active ? "إلغاء التفعيل" : "تفعيل"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStores.length === 0 && (
        <div className="text-center py-16">
          <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <StoreIcon className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm ? "لا توجد نتائج للبحث" : "لا توجد متاجر"}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? "جرب البحث بكلمات مختلفة" : "ابدأ بإنشاء متجرك الأول لبدء البيع"}
          </p>
          <Button onClick={() => setShowDialog(true)} className="px-6 py-3 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            إضافة متجر جديد
          </Button>
        </div>
      )}
    </div>
  )
}
