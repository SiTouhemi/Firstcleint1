"use client"

import { useState } from "react"
import { ShoppingCart, Eye, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function OrdersManagement() {
  const [statusFilter, setStatusFilter] = useState("all")

  const sampleOrders = [
    {
      id: "1001",
      customerName: "أحمد محمد",
      customerPhone: "0501234567",
      customerAddress: "الرياض، مصر الجديدة، شارع العروبة",
      total: 597,
      status: "delivered",
      date: "2024-01-15",
      time: "14:30",
      items: [
        { productName: "حذاء رياضي أديداس", quantity: 1, price: 299 },
        { productName: "قميص قطني كلاسيكي", quantity: 2, price: 149 },
      ],
    },
    {
      id: "1002",
      customerName: "فاطمة علي",
      customerPhone: "0509876543",
      customerAddress: "الإسكندرية، سموحة، طريق الجيش",
      total: 599,
      status: "shipped",
      date: "2024-01-14",
      time: "10:15",
      items: [{ productName: "سماعات لاسلكية", quantity: 1, price: 599 }],
    },
    {
      id: "1003",
      customerName: "خالد السعد",
      customerPhone: "0512345678",
      customerAddress: "الجيزة، المهندسين، شارع جامعة الدول العربية",
      total: 648,
      status: "processing",
      date: "2024-01-13",
      time: "16:45",
      items: [
        { productName: "حقيبة يد جلدية", quantity: 1, price: 399 },
        { productName: "حذاء كاجوال", quantity: 1, price: 249 },
      ],
    },
  ]

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "في الانتظار"
      case "processing":
        return "قيد المعالجة"
      case "shipped":
        return "تم الشحن"
      case "delivered":
        return "تم التسليم"
      case "cancelled":
        return "ملغي"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredOrders = sampleOrders.filter((order) => statusFilter === "all" || order.status === statusFilter)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            طلبات العملاء
          </h1>
          <p className="text-gray-600 mt-1">إدارة ومتابعة طلبات العملاء</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={statusFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("all")}
          className="whitespace-nowrap"
        >
          <Filter className="h-4 w-4 mr-1" />
          الكل
        </Button>
        {["pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(status)}
            className="whitespace-nowrap"
          >
            {getStatusText(status)}
          </Button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">طلب #{order.id}</CardTitle>
                  <p className="text-sm text-gray-600">
                    {order.date} - {order.time}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">معلومات العميل</h4>
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                    <p className="text-sm text-gray-600">{order.customerPhone}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">عنوان التوصيل</h4>
                    <p className="text-sm text-gray-600">{order.customerAddress}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">المنتجات</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                          {item.productName} × {item.quantity}
                        </span>
                        <span className="font-medium">{item.price * item.quantity} ر.س</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="font-medium text-gray-900">المجموع الكلي:</span>
                  <span className="text-lg font-bold text-blue-600">{order.total} ر.س</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد طلبات</h3>
          <p className="text-gray-600">لا توجد طلبات تطابق الفلتر المحدد</p>
        </div>
      )}
    </div>
  )
}
