"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Store,
  Package,
  Tags,
  ShoppingCart,
  Percent,
  ImageIcon,
  Settings,
  Menu,
  X,
  BarChart3,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const menuItems = [
    {
      id: "dashboard",
      label: "لوحة التحكم",
      icon: LayoutDashboard,
      description: "نظرة عامة على الإحصائيات",
    },
    {
      id: "stores",
      label: "إدارة المتاجر",
      icon: Store,
      description: "إنشاء وإدارة المتاجر",
    },
    {
      id: "categories",
      label: "إدارة الفئات",
      icon: Tags,
      description: "تنظيم فئات المنتجات",
    },
    {
      id: "products",
      label: "إدارة المنتجات",
      icon: Package,
      description: "إضافة وتعديل المنتجات",
    },
    {
      id: "orders",
      label: "إدارة الطلبات",
      icon: ShoppingCart,
      description: "متابعة ومعالجة الطلبات",
    },
    {
      id: "locations",
      label: "إدارة المواقع",
      icon: MapPin,
      description: "المدن والأحياء",
    },
    {
      id: "promo-codes",
      label: "أكواد الخصم",
      icon: Percent,
      description: "إنشاء عروض وخصومات",
    },
    {
      id: "banners",
      label: "إدارة البانرات",
      icon: ImageIcon,
      description: "البانرات الإعلانية",
    },
    {
      id: "analytics",
      label: "التقارير والتحليلات",
      icon: BarChart3,
      description: "تقارير مفصلة",
    },
    {
      id: "settings",
      label: "الإعدادات",
      icon: Settings,
      description: "إعدادات النظام",
    },
  ]

  const handleItemClick = (itemId: string) => {
    onTabChange(itemId)
    setIsMobileOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 right-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full bg-white border-l border-gray-200 z-40 transition-all duration-300",
          "lg:relative lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
          isCollapsed ? "w-16" : "w-80",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <div>
                  <h1 className="text-xl font-bold text-gray-900">لوحة التحكم</h1>
                  <p className="text-sm text-gray-600 mt-1">إدارة المتاجر الإلكترونية</p>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-right transition-all duration-200",
                    "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-4 border-blue-700"
                      : "text-gray-700 hover:text-gray-900",
                    isCollapsed && "justify-center px-2",
                  )}
                >
                  <Icon
                    className={cn(
                      "flex-shrink-0",
                      isActive ? "text-blue-700" : "text-gray-500",
                      isCollapsed ? "h-6 w-6" : "h-5 w-5",
                    )}
                  />

                  {!isCollapsed && (
                    <div className="flex-1 text-right">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                    </div>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Footer */}
          {!isCollapsed && (
            <div className="p-4 border-t border-gray-200">
              <div className="text-center text-xs text-gray-500">
                <p>نظام إدارة المتاجر الإلكترونية</p>
                <p className="mt-1">الإصدار 1.0.0</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
