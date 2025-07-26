"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function NotificationTest() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: "new_order",
    title: "",
    message: "",
    data: ""
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      const response = await fetch(`${backendUrl}/api/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: formData.type,
          title: formData.title,
          message: formData.message,
          data: formData.data ? JSON.parse(formData.data) : null
        })
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "تم إنشاء الإشعار",
          description: "تم إنشاء الإشعار بنجاح",
          duration: 3000,
        })
        setFormData({
          type: "new_order",
          title: "",
          message: "",
          data: ""
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء الإشعار",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  const createSampleOrder = async () => {
    setLoading(true)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      const response = await fetch(`${backendUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: "أحمد محمد",
          customer_phone: "01234567890",
          customer_address: "شارع التحرير، القاهرة",
          customer_lat: 30.0444,
          customer_lng: 31.2357,
          items: [
            { id: 1, name: "منتج تجريبي", price: 100, quantity: 2 }
          ],
          subtotal: 200,
          delivery_fee: 20,
          total: 220
        })
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "تم إنشاء الطلب",
          description: "تم إنشاء طلب تجريبي وإشعار جديد",
          duration: 3000,
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء الطلب",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>اختبار نظام الإشعارات</CardTitle>
          <CardDescription>
            استخدم هذه الأدوات لاختبا�� نظام الإشعارات في الوقت الفعلي
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={createSampleOrder} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "جاري الإنشاء..." : "إنشاء طلب تجريبي (سيظهر إشعار تلقائياً)"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>إنشاء إشعار مخصص</CardTitle>
          <CardDescription>
            أنشئ إشعاراً مخصصاً لاختبار النظام
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="type">نوع الإشعار</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الإشعار" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new_order">طلب جديد</SelectItem>
                  <SelectItem value="order_cancelled">إلغاء ��لب</SelectItem>
                  <SelectItem value="low_stock">مخزون منخفض</SelectItem>
                  <SelectItem value="system_alert">تنبيه النظام</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">عنوان الإشعار</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="أدخل عنوان الإشعار"
                required
              />
            </div>

            <div>
              <Label htmlFor="message">رسالة الإشعار</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="أدخل رسالة الإشعار"
                required
              />
            </div>

            <div>
              <Label htmlFor="data">بيانات إضافية (JSON اختياري)</Label>
              <Textarea
                id="data"
                value={formData.data}
                onChange={(e) => setFormData({...formData, data: e.target.value})}
                placeholder='{"order_number": "ORD-12345", "customer_name": "أحمد محمد"}'
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "جاري الإنشاء..." : "إنشاء الإشعار"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}