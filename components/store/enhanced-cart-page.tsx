"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Minus, Plus, Trash2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { useApp } from "@/app/providers"
import { LocationPicker } from "./location-picker"

interface CartPageProps {
  onBack: () => void
}

export function EnhancedCartPage({ onBack }: CartPageProps) {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCart()
  const { toast } = useToast()
  const [customerInfo, setCustomerInfo] = useState({
    phone: "",
    address: "",
    location: null as { lat: number; lng: number; name: string } | null,
  })
  const [discountCode, setDiscountCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [appliedPromoCode, setAppliedPromoCode] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Remove userData and user logic

  const applyDiscount = async () => {
    if (!discountCode.trim()) {
      toast({
        title: "كود خصم مطلوب",
        description: "يرجى إدخال كود الخصم",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/promo-codes/validate?code=${discountCode.toUpperCase()}`)
      const data = await response.json()

      if (!data.success) {
        toast({
          title: "كود خصم غير صالح",
          description: data.error || "يرجى التحقق من كود الخصم والمحاولة مرة أخرى",
          variant: "destructive",
        })
        return
      }

      const promoCode = data.promoCode

      // Check if code is expired
      if (promoCode.valid_until && new Date(promoCode.valid_until) < new Date()) {
        toast({
          title: "كود خصم منتهي الصلاحية",
          description: "هذا الكود منتهي الصلاحية",
          variant: "destructive",
        })
        return
      }

      // Check usage limit
      if (promoCode.usage_limit && promoCode.used_count >= promoCode.usage_limit) {
        toast({
          title: "كود خصم مستنفد",
          description: "تم استنفاد عدد مرات استخدام هذا الكود",
          variant: "destructive",
        })
        return
      }

      const subtotal = getTotalPrice()

      // Check minimum order amount
      if (subtotal < promoCode.min_order_amount) {
        toast({
          title: "المبلغ أقل من الحد الأدنى",
          description: `الحد الأدنى للطلب ${promoCode.min_order_amount} ر.س`,
          variant: "destructive",
        })
        return
      }

      // Calculate discount
      let discountAmount = 0
      if (promoCode.discount_type === "percentage") {
        discountAmount = Math.round(subtotal * (promoCode.discount_value / 100))
        if (promoCode.max_discount_amount) {
          discountAmount = Math.min(discountAmount, promoCode.max_discount_amount)
        }
      } else {
        discountAmount = Math.min(promoCode.discount_value, subtotal)
      }

      setDiscount(discountAmount)
      setAppliedPromoCode(promoCode)

      toast({
        title: "تم تطبيق كود الخصم",
        description: `تم تطبيق خصم ${discountAmount} ر.س`,
      })
    } catch (error) {
      console.error("Error applying discount:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تطبيق كود الخصم",
        variant: "destructive",
      })
    }
  }

  const handleCheckout = async () => {
    if (!customerInfo.phone.trim()) {
      toast({
        title: "معلومات ناقصة",
        description: "يرجى إدخال رقم الجوال",
        variant: "destructive",
      })
      return
    }

    if (!customerInfo.address.trim()) {
      toast({
        title: "معلومات ناقصة",
        description: "يرجى إدخال عنوان التوصيل",
        variant: "destructive",
      })
      return
    }

    const phoneRegex = /^05\d{8}$/
    if (!phoneRegex.test(customerInfo.phone.trim())) {
      toast({
        title: "رقم جوال غير صحيح",
        description: "يرجى إدخال رقم جوال صحيح (05xxxxxxxx)",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Generate order number (can be handled by backend)
      // Calculate totals
      const subtotal = getTotalPrice()
      const deliveryFee = subtotal >= 200 ? 0 : 25 // Free delivery over 200 SAR
      const total = subtotal - discount + deliveryFee

      // Prepare order data
      const orderData = {
        customer_name: customerInfo.phone, // Use customer phone as name for now
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address,
        subtotal,
        promo_code_id: appliedPromoCode?.id,
        promo_code: appliedPromoCode?.code,
        discount_amount: discount,
        delivery_fee: deliveryFee,
        total,
        status: "pending",
        payment_status: "pending",
        location_lat: customerInfo.location?.lat,
        location_lng: customerInfo.location?.lng,
        location_name: customerInfo.location?.name,
        items: items.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          product_price: item.price,
          quantity: item.quantity,
          total_price: item.price * item.quantity,
        })),
      }

      // Send order to backend API
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      const response = await fetch(`${backendUrl}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) throw new Error("فشل في إرسال الطلب")
      const result = await response.json()
      if (!result.success) throw new Error(result.error || "فشل في إرسال الطلب")

      // Clear cart and form
      clearCart()
      setCustomerInfo({ phone: "", address: "", location: null })
      setDiscountCode("")
      setDiscount(0)
      setAppliedPromoCode(null)

      toast({
        title: "تم تأكيد الطلب",
        description: `طلبك قيد المعالجة. المبلغ: ${total} ر.س`,
      })

      setTimeout(() => onBack(), 2000)
    } catch (error) {
      console.error("Error creating order:", error)
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إنشاء الطلب",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white min-h-screen">
          <div className="p-5 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowRight className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">سلة التسوق</h1>
                <p className="text-sm text-gray-600">راجع منتجاتك قبل إتمام الطلب</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-20 px-5 text-center">
            <ShoppingCart className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">سلة التسوق فارغة</h3>
            <p className="text-gray-600 mb-6">لا توجد منتجات في سلة التسوق</p>
            <Button onClick={onBack}>تصفح المنتجات</Button>
          </div>
        </div>
      </div>
    )
  }

  const subtotal = getTotalPrice()
  const deliveryFee = subtotal >= 200 ? 0 : 25
  const total = subtotal - discount + deliveryFee

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowRight className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">سلة التسوق</h1>
              <p className="text-sm text-gray-600">راجع منتجاتك قبل إتمام الطلب</p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Cart Items */}
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-3">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-20 h-20 rounded-lg object-cover"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                <div className="text-blue-600 font-bold">
                  {item.price} ر.س{item.unit && `/${item.unit}`}
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center bg-gray-100 rounded-full">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-3 font-semibold">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {/* Customer Info */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h4 className="font-semibold mb-4">معلومات العميل</h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم الجوال</label>
                <Input
                  type="tel"
                  placeholder="05xxxxxxxx"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">عنوان التوصيل</label>
                <Textarea
                  placeholder="أدخل عنوان التوصيل بالتفصيل"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo((prev) => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <LocationPicker onLocationSelect={(location) => setCustomerInfo((prev) => ({ ...prev, location }))} />
            </div>
          </div>

          {/* Discount Code */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h4 className="font-semibold mb-4">كود الخصم</h4>
            <div className="flex gap-2">
              <Input
                placeholder="أدخل كود الخصم"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                disabled={!!appliedPromoCode}
              />
              <Button onClick={applyDiscount} disabled={!!appliedPromoCode}>
                {appliedPromoCode ? "مطبق" : "تطبيق"}
              </Button>
            </div>
            {appliedPromoCode && (
              <div className="mt-2 p-2 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  تم تطبيق كود الخصم: <strong>{appliedPromoCode.code}</strong>
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAppliedPromoCode(null)
                    setDiscount(0)
                    setDiscountCode("")
                  }}
                  className="text-red-600 hover:text-red-700 p-0 h-auto"
                >
                  إزالة
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span>{subtotal} ر.س</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>الخصم:</span>
                  <span>-{discount} ر.س</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>رسوم التوصيل:</span>
                <span>{deliveryFee === 0 ? "مجاني" : `${deliveryFee} ر.س`}</span>
              </div>

              {subtotal < 200 && <p className="text-xs text-gray-500">توصيل مجاني للطلبات أكثر من 200 ر.س</p>}

              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>المجموع الكلي:</span>
                <span>{total} ر.س</span>
              </div>
            </div>

            <Button className="w-full mt-4" onClick={handleCheckout} disabled={loading}>
              {loading ? "جاري إنشاء الطلب..." : "إتمام الطلب"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
