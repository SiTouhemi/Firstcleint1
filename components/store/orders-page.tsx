"use client"

import { ArrowRight, Package, Clock, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface OrdersPageProps {
  onBack: () => void
}

export function OrdersPage({ onBack }: OrdersPageProps) {
  // Mock orders data - in real app, fetch from API
  const orders = [
    {
      id: "1",
      store_name: "متجر الخضار الطازجة",
      total_amount: 85.5,
      status: "delivered" as const,
      created_at: "2024-01-15T10:30:00Z",
      items: [
        { product_name: "طماطم", quantity: 2, price: 15.0 },
        { product_name: "خيار", quantity: 1, price: 8.5 },
      ],
    },
    {
      id: "2",
      store_name: "مخبز الأصالة",
      total_amount: 25.0,
      status: "preparing" as const,
      created_at: "2024-01-16T14:20:00Z",
      items: [{ product_name: "خبز عربي", quantity: 5, price: 5.0 }],
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "preparing":
        return <Package className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "في الانتظار"
      case "preparing":
        return "قيد التحضير"
      case "delivered":
        return "تم التسليم"
      case "cancelled":
        return "ملغي"
      default:
        return "غير معروف"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "preparing":
        return "bg-blue-100 text-blue-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowRight className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">الطلبات</h1>
        </div>
      </header>

      <main className="px-4 py-6 pb-20">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد طلبات</h3>
            <p className="text-gray-600 mb-4">لم تقم بإجراء أي طلبات بعد</p>
            <Button onClick={onBack}>تصفح المنتجات</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{order.store_name}</h3>
                      <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString("ar-SA")}</p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </div>
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.product_name} × {item.quantity}
                        </span>
                        <span>{(item.price * item.quantity).toFixed(2)} ر.س</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="font-bold">المجموع:</span>
                    <span className="font-bold">{order.total_amount.toFixed(2)} ر.س</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
