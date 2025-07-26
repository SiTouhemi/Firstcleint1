"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { StoresManagement } from "@/components/admin/stores-management"
import { CategoriesManagement } from "@/components/admin/categories-management"
import { ProductsManagement } from "@/components/admin/products-management"
import { OrdersManagement } from "@/components/admin/orders-management"
import { BarChart3, Store, Package, Tags, ShoppingCart, MapPin, Percent, Settings, X, Menu, ImageIcon, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CitiesManagement } from "@/components/admin/cities-management"
import { PromoCodesManagement } from "@/components/admin/promo-codes-management"
import { DashboardOverview } from "@/components/admin/dashboard-overview"
import { StoreSettings } from "@/components/admin/store-settings"
import { RealTimeNotifications } from "@/components/admin/real-time-notifications"
import { BannersManagement } from "@/components/admin/banners-management"
import { NotificationTest } from "@/components/admin/notification-test"

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const menuItems = [
    { id: "dashboard", label: "لوحة التحكم", icon: BarChart3 },
    { id: "stores", label: "إدارة المتاجر", icon: Store },
    { id: "categories", label: "إدارة الفئات", icon: Tags },
    { id: "products", label: "إدارة المنتجات", icon: Package },
    { id: "orders", label: "طلبات العملاء", icon: ShoppingCart },
    { id: "cities", label: "إدارة المدن", icon: MapPin },
    { id: "promo-codes", label: "أكواد الخصم", icon: Percent },
    { id: "banners", label: "إدارة البانرات", icon: ImageIcon },
    { id: "settings", label: "الإعدادات", icon: Settings },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "stores":
        return <StoresManagement />;
      case "categories":
        return <CategoriesManagement />;
      case "products":
        return <ProductsManagement />;
      case "orders":
        return <OrdersManagement />;
      case "cities":
        return <CitiesManagement />;
      case "promo-codes":
        return <PromoCodesManagement />;
      case "banners":
        return <BannersManagement />;
      case "settings":
        return (
          <div className="space-y-6">
            <StoreSettings />
            <NotificationTest />
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  const handleLogout = () => {
    // Clear admin token cookie
    if (typeof window !== 'undefined') {
      document.cookie = 'admin_token=; Max-Age=0; path=/;';
      localStorage.removeItem("adminToken");
    }
    router.push("/admin/login")
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
            <div className="flex items-center gap-4">
              <RealTimeNotifications />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                title="تسجيل الخروج"
              >
                <LogOut className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden">
                <X className="h-6 w-6" />
              </Button>
            </div>
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
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-6 py-3 text-right transition-colors text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">تسجيل الخروج</span>
            </button>
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
