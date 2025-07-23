"use client"

import { useState } from "react"
import { AdminSidebar } from "./sidebar"
import { DashboardOverview } from "./dashboard-overview"
import { StoreSettings } from "./store-settings"
import { CategoriesManagement } from "./categories-management"
import { ProductsManagement } from "./products-management"
import { OrdersManagement } from "./orders-management"
import { LocationsManagement } from "./locations-management"
import { PromoCodesManagement } from "./promo-codes-management"
import { UsersManagement } from "./users-management"
import { BannersManagement } from "./banners-management"
import { RealTimeNotifications } from "./real-time-notifications"

interface AdminDashboardProps {
  onLogout: () => void
}

export function ComprehensiveDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />
      case "store-settings":
        return <StoreSettings />
      case "categories":
        return <CategoriesManagement />
      case "products":
        return <ProductsManagement />
      case "orders":
        return <OrdersManagement />
      case "locations":
        return <LocationsManagement />
      case "promo-codes":
        return <PromoCodesManagement />
      case "users":
        return <UsersManagement />
      case "banners":
        return <BannersManagement />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={onLogout} />

      <main className="flex-1 p-6 mr-64">
        <div className="flex justify-between items-center mb-6">
          <div></div>
          <RealTimeNotifications />
        </div>
        {renderContent()}
      </main>
    </div>
  )
}
