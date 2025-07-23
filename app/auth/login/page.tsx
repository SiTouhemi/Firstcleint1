"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Phone, User, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useApp } from "@/app/providers"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    phone: "",
    fullName: "",
    city: "",
    district: "",
    address: "",
  })
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { supabase } = useApp()
  const router = useRouter()

  const cities = [
    "الرياض",
    "جدة",
    "الدمام",
    "مكة المكرمة",
    "المدينة المنورة",
    "القاهرة",
    "الإسكندرية",
    "الجيزة",
    "أسوان",
    "الأقصر",
  ]

  const districts = {
    الرياض: ["العليا", "الملز", "النخيل", "الروضة", "السليمانية"],
    جدة: ["الصفا", "الروضة", "البلد", "الحمراء"],
    الدمام: ["الفيصلية", "الشاطئ", "الخبر"],
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.phone.match(/^05\d{8}$/)) {
      toast({
        title: "رقم جوال غير صحيح",
        description: "يرجى إدخال رقم جوال صحيح (05xxxxxxxx)",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Check if user exists
      const { data: existingUser } = await supabase.from("users").select("*").eq("phone", formData.phone).single()

      if (existingUser) {
        // User exists, log them in
        localStorage.setItem("currentUser", JSON.stringify(existingUser))
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: `مرحباً ${existingUser.full_name}`,
        })
        router.push("/")
      } else {
        // New user, show registration form
        setShowForm(true)
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء التحقق من البيانات",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.fullName.trim() || !formData.city || !formData.district || !formData.address.trim()) {
      toast({
        title: "معلومات ناقصة",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Get city ID
      const { data: cityData } = await supabase.from("cities").select("id").eq("name", formData.city).single()

      // Get district ID
      const { data: districtData } = await supabase
        .from("districts")
        .select("id")
        .eq("name", formData.district)
        .eq("city_id", cityData?.id)
        .single()

      // Create new user
      const { data: newUser, error } = await supabase
        .from("users")
        .insert({
          phone: formData.phone,
          full_name: formData.fullName,
          city_id: cityData?.id,
          district_id: districtData?.id,
          address: formData.address,
        })
        .select()
        .single()

      if (error) throw error

      localStorage.setItem("currentUser", JSON.stringify(newUser))
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: `مرحباً ${newUser.full_name}`,
      })
      router.push("/")
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء الحساب",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            {showForm ? "إنشاء حساب جديد" : "تسجيل الدخول"}
          </CardTitle>
          <p className="text-gray-600">{showForm ? "أكمل بياناتك لإنشاء حساب جديد" : "أدخل رقم جوالك للمتابعة"}</p>
        </CardHeader>

        <CardContent>
          {!showForm ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم الجوال</label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="05xxxxxxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    className="pr-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "جاري التحقق..." : "متابعة"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegistration} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="أدخل اسمك الكامل"
                    value={formData.fullName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                    className="pr-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">المدينة</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={formData.city}
                    onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value, district: "" }))}
                    required
                  >
                    <option value="">اختر المدينة</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الحي</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={formData.district}
                    onChange={(e) => setFormData((prev) => ({ ...prev, district: e.target.value }))}
                    required
                    disabled={!formData.city}
                  >
                    <option value="">اختر الحي</option>
                    {formData.city &&
                      districts[formData.city as keyof typeof districts]?.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">العنوان التفصيلي</label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    className="w-full p-2 pr-10 border border-gray-300 rounded-md resize-none"
                    rows={3}
                    placeholder="أدخل عنوانك التفصيلي"
                    value={formData.address}
                    onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                  رجوع
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
