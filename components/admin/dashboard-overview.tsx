"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Store,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"

interface DashboardStats {
  totalStores: number
  activeStores: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  processingOrders: number
  deliveredOrders: number
  cancelledOrders: number
}

interface RecentOrder {
  id: string
  order_number: string
  customer_name: string
  total: number
  status: string
  created_at: string
  store_name: string
}

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStores: 0,
    activeStores: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [statsResponse, ordersResponse] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/dashboard/recent-orders"),
      ])

      const statsData = await statsResponse.json()
      const ordersData = await ordersResponse.json()

      if (statsData.success) {
        setStats(statsData.data)
      }

      if (ordersData.success) {
        setRecentOrders(ordersData.data)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
      case "preparing":
        return "bg-blue-100 text-blue-800"
      case "ready":
      case "out_for_delivery":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "في الانتظار"
      case "confirmed":
        return "مؤكد"
      case "preparing":
        return "قيد التحضير"
      case "ready":
        return "جاهز"
      case "out_for_delivery":
        return "في الطريق"
      case "delivered":
        return "تم التسليم"
      case "cancelled":
        return "ملغي"
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "confirmed":
      case "preparing":
      case "ready":
        return <AlertCircle className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Store className="h-8 w-8 text-blue-600" />
          </div>
          لوحة التحكم
        </h1>
        <p className="text-gray-600 mt-2">نظرة عامة على أداء المتاجر والطلبات</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">إجمالي المتاجر</p>
                <p className="text-3xl font-bold">{stats.totalStores}</p>
                <p className="text-blue-200 text-xs mt-1">{stats.activeStores} متجر نشط</p>
              </div>
              <Store className="h-12 w-12 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">إجمالي المنتجات</p>
                <p className="text-3xl font-bold">{stats.totalProducts}</p>
                <p className="text-green-200 text-xs mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% من الشهر الماضي
                </p>
              </div>
              <Package className="h-12 w-12 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">إجمالي الطلبات</p>
                <p className="text-3xl font-bold">{stats.totalOrders}</p>
                <p className="text-purple-200 text-xs mt-1">{stats.pendingOrders} طلب في الانتظار</p>
              </div>
              <ShoppingCart className="h-12 w-12 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">إجمالي المبيعات</p>
                <p className="text-3xl font-bold">{stats.totalRevenue.toLocaleString()} ر.س</p>
                <p className="text-orange-200 text-xs mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +15% من الشهر الماضي
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              توزيع الطلبات حسب الحالة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                  <span className="text-sm">في الانتظار</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{stats.pendingOrders}</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: `${stats.totalOrders > 0 ? (stats.pendingOrders / stats.totalOrders) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm">قيد المعالجة</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{stats.processingOrders}</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${stats.totalOrders > 0 ? (stats.processingOrders / stats.totalOrders) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">تم التسليم</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{stats.deliveredOrders}</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${stats.totalOrders > 0 ? (stats.deliveredOrders / stats.totalOrders) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm">ملغي</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{stats.cancelledOrders}</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{
                        width: `${stats.totalOrders > 0 ? (stats.cancelledOrders / stats.totalOrders) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              أحدث الطلبات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <div>
                          <p className="font-medium text-sm">#{order.order_number}</p>
                          <p className="text-xs text-gray-600">{order.customer_name}</p>
                          <p className="text-xs text-gray-500">{order.store_name}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm">{order.total} ر.س</p>
                      <Badge className={`text-xs ${getStatusColor(order.status)}`}>{getStatusText(order.status)}</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>لا توجد طلبات حديثة</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 hover:bg-blue-50 hover:border-blue-300 bg-transparent"
            >
              <Store className="h-6 w-6 text-blue-600" />
              <span className="text-sm">إضافة متجر جديد</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 hover:bg-green-50 hover:border-green-300 bg-transparent"
            >
              <Package className="h-6 w-6 text-green-600" />
              <span className="text-sm">إضافة منتج جديد</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 hover:bg-purple-50 hover:border-purple-300 bg-transparent"
            >
              <ShoppingCart className="h-6 w-6 text-purple-600" />
              <span className="text-sm">عرض الطلبات</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2 hover:bg-orange-50 hover:border-orange-300 bg-transparent"
            >
              <MapPin className="h-6 w-6 text-orange-600" />
              <span className="text-sm">إدارة المواقع</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
