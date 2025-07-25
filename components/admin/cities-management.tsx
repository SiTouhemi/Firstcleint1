import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export function CitiesManagement() {
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({ name: "" })
  const { toast } = useToast()

  useEffect(() => {
    fetchCities()
  }, [])

  const fetchCities = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/cities")
      const data = await response.json()
      if (data.success) {
        setCities(data.data)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({ title: "خطأ", description: "حدث خطأ أثناء جلب المدن", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleAddCity = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast({ title: "بيانات ناقصة", description: "يرجى إدخال اسم المدينة", variant: "destructive" })
      return
    }
    try {
      const response = await fetch("/api/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name })
      })
      const data = await response.json()
      if (data.success) {
        toast({ title: "تمت الإضافة", description: "تمت إضافة المدينة بنجاح" })
        setFormData({ name: "" })
        fetchCities()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({ title: "خطأ", description: "حدث خطأ أثناء إضافة المدينة", variant: "destructive" })
    }
  }

  const handleToggleActive = async (city) => {
    try {
      const response = await fetch(`/api/cities/${city.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !city.is_active })
      })
      const data = await response.json()
      if (data.success) {
        fetchCities()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({ title: "خطأ", description: "حدث خطأ أثناء تحديث حالة المدينة", variant: "destructive" })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            إدارة المدن
          </h1>
          <p className="text-gray-600 mt-1">إضافة وتفعيل/تعطيل المدن المتاحة</p>
        </div>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>إضافة مدينة جديدة</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCity} className="flex gap-2">
            <Input
              value={formData.name}
              onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
              placeholder="اسم المدينة"
              required
            />
            <Button type="submit">إضافة</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8">جاري التحميل...</div>
        ) : cities.length === 0 ? (
          <div className="col-span-full text-center py-8">لا توجد مدن</div>
        ) : (
          cities.map(city => (
            <Card key={city.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  {city.name}
                  <span className={`text-xs px-2 py-1 rounded-full ${city.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {city.is_active ? "نشطة" : "غير نشطة"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">تاريخ الإضافة: {city.created_at ? new Date(city.created_at).toLocaleDateString("ar-SA") : "-"}</span>
                  <Button size="sm" variant="outline" onClick={() => handleToggleActive(city)}>
                    {city.is_active ? "تعطيل" : "تفعيل"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
} 