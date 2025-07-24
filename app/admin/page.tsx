"use client"

import { useState } from "react"
import { StoresManagement } from "@/components/admin/stores-management"
import { CategoriesManagement } from "@/components/admin/categories-management"
import { ProductsManagement } from "@/components/admin/products-management"
import { OrdersManagement } from "@/components/admin/orders-management"
import { Store, Package, Tags, ShoppingCart, BarChart3, Settings, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { id: "dashboard", label: "لوحة التحكم", icon: BarChart3 },
    { id: "stores", label: "إدارة المتاجر", icon: Store },
    { id: "categories", label: "إدارة الفئات", icon: Tags },
    { id: "products", label: "إدارة المنتجات", icon: Package },
    { id: "orders", label: "طلبات العملاء", icon: ShoppingCart },
    { id: "settings", label: "الإعدادات", icon: Settings },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "stores":
        return <StoresManagement />
      case "categories":
        return <CategoriesManagement />
      case "products":
        return <ProductsManagement />
      case "orders":
        return <OrdersManagement />
      case "dashboard":
      default:
        return (
          <div className="space-y-6" dir="rtl">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                لوحة التحكم
              </h1>
              <p className="text-gray-600 mt-2">نظرة عامة على أداء النظام</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">إجمالي المتاجر</p>
                    <p className="text-3xl font-bold">12</p>
                  </div>
                  <Store className="h-12 w-12 text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">إجمالي المنتجات</p>
                    <p className="text-3xl font-bold">1,234</p>
                  </div>
                  <Package className="h-12 w-12 text-green-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">إجمالي الطلبات</p>
                    <p className="text-3xl font-bold">567</p>
                  </div>
                  <ShoppingCart className="h-12 w-12 text-purple-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">إجمالي الفئات</p>
                    <p className="text-3xl font-bold">89</p>
                  </div>
                  <Tags className="h-12 w-12 text-orange-200" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">مرحباً بك في لوحة التحكم</h2>
              <p className="text-gray-600 mb-4">
                يمكنك من هنا إدارة جميع جوانب النظام بسهولة. استخدم القائمة الجانبية للتنقل بين الأقسام المختلفة.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={() => setActiveTab("stores")} className="justify-start h-12" variant="outline">
                  <Store className="h-5 w-5 mr-2" />
                  إدارة المتاجر
                </Button>
                <Button onClick={() => setActiveTab("products")} className="justify-start h-12" variant="outline">
                  <Package className="h-5 w-5 mr-2" />
                  إدارة المنتجات
                </Button>
                <Button onClick={() => setActiveTab("categories")} className="justify-start h-12" variant="outline">
                  <Tags className="h-5 w-5 mr-2" />
                  إدارة الفئات
                </Button>
                <Button onClick={() => setActiveTab("orders")} className="justify-start h-12" variant="outline">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  طلبات العملاء
                </Button>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
        >
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">م</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">لوحة الإدارة</h1>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="h-6 w-6" />
            </Button>
          </div>

          <nav className="mt-6">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-6 py-3 text-right transition-colors ${
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:mr-64">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white border-b px-4 py-3">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* Content */}
          <main className="p-6">{renderContent()}</main>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
