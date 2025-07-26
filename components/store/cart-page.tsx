"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Minus, Trash2, MapPin, X, ShoppingCart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/hooks/use-cart"
import { useToast } from "@/hooks/use-toast"
import { AdminLocationPicker } from "@/components/admin/location-picker"

interface CartPageProps {
  onBack: () => void
}

export function CartPage({ onBack }: CartPageProps) {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState({ lat: 24.7136, lng: 46.6753 })
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
  })
  const [promoCode, setPromoCode] = useState("")
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoLoading, setPromoLoading] = useState(false)
  const [promoError, setPromoError] = useState("")
  const [promoSuccess, setPromoSuccess] = useState("")

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast({
        title: "السلة فارغة",
        description: "يرجى إضافة منتجات للسلة أولاً",
        variant: "destructive",
      })
      return
    }

    if (!customerInfo.name.trim() || !customerInfo.phone.trim() || !customerInfo.address.trim()) {
      toast({
        title: "معلومات ناقصة",
        description: "يرجى ملء جميع الحقول المطلوبة",
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
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      const orderData = {
        customer_name: customerInfo.name.trim(),
        customer_phone: customerInfo.phone.trim(),
        customer_address: customerInfo.address.trim(),
        // customer_lat: selectedLocation.lat,  // Temporarily disabled - column doesn't exist
        // customer_lng: selectedLocation.lng,  // Temporarily disabled - column doesn't exist
        items: items.map((item) => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        })),
        subtotal: subtotal,
        delivery_fee: deliveryFee,
        discount_amount: promoDiscount,
        promo_code: promoCode.trim() || null,
        total: total,
      }

      const response = await fetch(`${backendUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          toast({
            title: "تم إرسال الطلب بنجاح",
            description: `رقم الطلب: ${result.data.order_number}`,
          })
          clearCart()
          setCustomerInfo({ name: "", phone: "", address: "" })
          setTimeout(() => onBack(), 2000)
        } else {
          // Show user-friendly error from backend
          toast({
            title: "خطأ",
            description: result.error || "فشل في إرسال الطلب",
            variant: "destructive",
          })
          if (result.details) {
            console.error("Order error details:", result.details)
          }
        }
      } else {
        // Try to parse backend error message
        let errorMsg = "فشل في إرسال الطلب"
        let details = null
        try {
          const result = await response.json()
          errorMsg = result.error || errorMsg
          details = result.details
        } catch {}
        toast({
          title: "خطأ",
          description: errorMsg,
          variant: "destructive",
        })
        if (details) {
          console.error("Order error details:", details)
        }
      }
    } catch (error) {
      console.error("Error creating order:", error)
      toast({
        title: "خطأ في الاتصال",
        description: "فشل في الاتصال بالخادم. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }



  const deliveryFee = getTotalPrice() >= 100 ? 0 : 15
  const subtotal = getTotalPrice()
  const total = subtotal + deliveryFee - promoDiscount

  const handlePromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoError("يرجى إدخال كود الخصم")
      return
    }

    setPromoLoading(true)
    setPromoError("")
    setPromoSuccess("")

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      const response = await fetch(`${backendUrl}/api/promo-codes/validate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: promoCode.trim(),
          subtotal: subtotal,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setPromoDiscount(data.discount_amount || 0)
        setPromoSuccess(data.message || "تم تطبيق كود الخصم بنجاح")
        toast({
          title: "تم تطبيق كود الخصم",
          description: `تم خصم ${data.discount_amount} ر.س من إجمالي الطلب`,
        })
      } else {
        setPromoError(data.error || "كود الخصم غير صحيح")
        setPromoDiscount(0)
      }
    } catch (error) {
      setPromoError("حدث خطأ في التحقق من كود الخصم")
      setPromoDiscount(0)
    } finally {
      setPromoLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-gray-600">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold text-gray-900">سلة المشتريات</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="p-4">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">السلة فارغة</h3>
            <p className="text-gray-600 mb-6">لم تقم بإضافة أي منتجات للسلة بعد</p>
            <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700">
              تصفح المنتجات
            </Button>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            {/* Cart Items */}
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl border p-3 flex items-center gap-3 shadow-sm">
                  <img
                    src={item.image_url || "/placeholder.svg?height=60&width=60&query=product"}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-600">
                      {item.price} ر.س{item.unit && ` / ${item.unit}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Form & Summary */}
            <div className="cart-summary bg-white rounded-xl border shadow p-5 mt-6">
              <div className="customer-info mb-4 pb-4 border-b">
                <h4 className="text-lg font-bold mb-4">معلومات العميل</h4>
                <div className="form-group mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل *</label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="أدخل اسمك الكامل"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">رقم الجوال *</label>
                  <input
                    type="tel"
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="05xxxxxxxx"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo((prev) => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان التوصيل *
                    {selectedLocation.lat !== 24.7136 || selectedLocation.lng !== 46.6753 ? (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ موقع محدد
                      </span>
                    ) : null}
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    اكتب عنوانك بالتفصيل (مثل: رقم المنزل، اسم الشارع، الحي) أو اختر موقعك من الخريطة
                  </p>
                  <div className="flex gap-2">
                    <textarea
                      className="flex-1 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="مثال: شارع الملك فهد، حي العليا، الرياض، رقم المنزل 123"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo((prev) => ({ ...prev, address: e.target.value }))}
                      rows={3}
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 border-gray-200 hover:bg-blue-50"
                      onClick={() => setShowMap(true)}
                      title="تحديد الموقع على الخريطة"
                    >
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </Button>
                  </div>
                </div>
              </div>
              {/* Promo Code Section */}
              <div className="mb-4 pb-4 border-b">
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="كود الخصم (اختياري)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={promoLoading}
                  />
                  <Button
                    onClick={handlePromoCode}
                    disabled={promoLoading || !promoCode.trim()}
                    size="sm"
                    className="px-4"
                  >
                    {promoLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "تطبيق"
                    )}
                  </Button>
                </div>
                {promoError && (
                  <p className="text-red-500 text-xs mt-2">{promoError}</p>
                )}
                {promoSuccess && (
                  <p className="text-green-600 text-xs mt-2">{promoSuccess}</p>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="summary-row flex justify-between items-center text-sm">
                  <span>المجموع الفرعي:</span>
                  <span>{subtotal.toFixed(2)} ر.س</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="summary-row flex justify-between items-center text-sm text-green-600">
                    <span>خصم:</span>
                    <span>-{promoDiscount.toFixed(2)} ر.س</span>
                  </div>
                )}
                <div className="summary-row flex justify-between items-center text-sm">
                  <span>رسوم التوصيل:</span>
                  <span>{deliveryFee === 0 ? "مجاني" : `${deliveryFee.toFixed(2)} ر.س`}</span>
                </div>
                {getTotalPrice() < 100 && (
                  <p className="text-xs text-gray-500">توصيل مجاني للطلبات أكثر من 100 ر.س</p>
                )}
                <div className="summary-row total flex justify-between items-center border-t pt-3 mt-2 text-lg font-bold">
                  <span>المجموع الكلي:</span>
                  <span>{total.toFixed(2)} ر.س</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="checkout-btn w-full bg-blue-600 text-white rounded-lg py-3 text-lg font-bold mt-4 hover:bg-blue-700 transition"
                disabled={loading}
                type="button"
              >
                {loading ? "جاري إرسال الطلب..." : "إتمام الطلب"}
              </button>
            </div>
          </div>
        )}

        {/* Map Modal */}
        <Dialog open={showMap} onOpenChange={setShowMap}>
          <DialogContent className="max-w-md mx-auto p-0">
            <AdminLocationPicker
              onLocationSelect={(location) => {
                setSelectedLocation({ lat: location.lat, lng: location.lng });
                setCustomerInfo(prev => ({
                  ...prev,
                  address: location.address || `موقع محدد على الخريطة: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
                }));
                setShowMap(false);
                toast({
                  title: "تم تحديد الموقع",
                  description: "تم تحديد موقع التوصيل بنجاح",
                });
              }}
              initialLocation={{ lat: selectedLocation.lat, lng: selectedLocation.lng, address: customerInfo.address }}
            />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
