"use client"

import { useEffect, useState } from "react"
import { ShoppingCart, Eye, Filter, CheckCircle, Clock, Truck, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Order {
  id: string;
  order_number?: string;
  created_at?: string;
  status: string;
  customer_name?: string;
  customer_phone?: string;
  customer_address?: string;
  customer_lat?: number;
  customer_lng?: number;
  total?: number;
}

export function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/orders")
      const result = await response.json()
      if (result.success) {
        setOrders(result.data || [])
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus })
      })
      const result = await response.json()
      if (result.success) {
        fetchOrders()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      // Optionally show error toast
    }
  }

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders.filter((order) => statusFilter === "all" || order.status === statusFilter)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            طلبات العملاء
          </h1>
          <p className="text-gray-600 mt-1">إدارة ومتابعة طلبات العملاء</p>
        </div>
      </div>

      {/* Status Filter - Mobile Optimized */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">فلتر الحالة:</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-2">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
            className="whitespace-nowrap text-xs sm:text-sm"
          >
            الكل
          </Button>
          {["pending", "processing", "shipped", "delivered", "cancelled"].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="whitespace-nowrap text-xs sm:text-sm"
            >
              {getStatusText(status)}
            </Button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-right">رقم الطلب</th>
              <th className="px-4 py-2 text-right">التاريخ</th>
              <th className="px-4 py-2 text-right">الحالة</th>
              <th className="px-4 py-2 text-right">العميل</th>
              <th className="px-4 py-2 text-right">المجموع</th>
              <th className="px-4 py-2 text-right">الموقع</th>
              <th className="px-4 py-2 text-right">الموقع على الخريطة</th>
              <th className="px-4 py-2 text-right">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">جاري التحميل...</p>
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8">
                  <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد طلبات</h3>
                  <p className="text-gray-600">لا توجد طلبات تطابق الفلتر المحدد</p>
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                // Try to get coordinates if available, else use address
                let mapUrl = "";
                if (order.customer_lat && order.customer_lng) {
                  mapUrl = `https://www.google.com/maps?q=${order.customer_lat},${order.customer_lng}`;
                } else if (order.customer_address) {
                  mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.customer_address)}`;
                }
                return (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-bold">#{order.order_number || order.id}</td>
                    <td className="px-4 py-2">{order.created_at ? new Date(order.created_at).toLocaleDateString("ar-SA") : "-"}</td>
                    <td className="px-4 py-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-4 py-2">{order.customer_name}</td>
                    <td className="px-4 py-2 font-bold text-blue-600">{order.total} ر.س</td>
                    <td className="px-4 py-2">
                      <div className="max-w-xs">
                        <p className="text-sm text-gray-900 break-words">
                          {order.customer_address || "غير محدد"}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      {mapUrl ? (
                        <a
                          href={mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline text-xs"
                        >
                          عرض على الخريطة
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">غير متوفر</span>
                      )}
                    </td>
                    <td className="px-4 py-2 flex gap-2 items-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </span>
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        className={`border rounded px-2 py-1 text-xs focus:outline-none ${getStatusColor(order.status)}`}
                        style={{ minWidth: 110 }}
                      >
                        <option value="pending">في الانتظار</option>
                        <option value="delivered">تم التسليم</option>
                        <option value="cancelled">ملغي</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
