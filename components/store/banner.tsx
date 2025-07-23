"use client"

import { useState, useEffect } from "react"
import type { BannerType } from "@/types"

export function BannerComponent() {
  const [banners, setBanners] = useState<BannerType[]>([])
  const [currentBanner, setCurrentBanner] = useState(0)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
        const response = await fetch(`${backendUrl}/api/banners`)
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setBanners(data.data)
          }
        }
      } catch (error) {
        console.error("Error fetching banners:", error)
      }
    }

    fetchBanners()
  }, [])

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [banners.length])

  if (banners.length === 0) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 mx-4 mt-4 rounded-xl">
        <h2 className="text-xl font-bold mb-2">مرحباً بك في متجرنا</h2>
        <p className="text-blue-100">اكتشف أفضل المنتجات بأسعار مميزة</p>
      </div>
    )
  }

  const banner = banners[currentBanner]

  return (
    <div className="relative mx-4 mt-4">
      <div
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl min-h-32 flex flex-col justify-center"
        style={{
          backgroundImage: banner.image_url ? `url(${banner.image_url})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-2">{banner.title}</h2>
          {banner.description && <p className="text-blue-100">{banner.description}</p>}
        </div>
        {banner.image_url && <div className="absolute inset-0 bg-black bg-opacity-30 rounded-xl" />}
      </div>

      {banners.length > 1 && (
        <div className="flex justify-center mt-2 gap-1">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentBanner ? "bg-blue-600" : "bg-gray-300"
              }`}
              onClick={() => setCurrentBanner(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
