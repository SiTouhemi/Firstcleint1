"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
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
import { CitiesManagement } from "./cities-management";
import { MapPin } from "lucide-react";

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
      case "cities":
        return <CitiesManagement />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={onLogout} />

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
