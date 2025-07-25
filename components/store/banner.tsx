"use client"

import { useState, useEffect } from "react"
import type { Banner } from "@/types"

interface BannerComponentProps {
  banners: Banner[]
}

export function BannerComponent({ banners }: BannerComponentProps) {
  const [currentBanner, setCurrentBanner] = useState(0)

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [banners.length])

  if (banners.length === 0) {
    return null;
  }

  const banner = banners[currentBanner];

  return (
    <div className="banner-section px-5 pt-4">
      <div
        className="banner flex items-center justify-between rounded-xl p-5 relative overflow-hidden"
        style={{
          background: banner.background_color || "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
        }}
      >
        <div className="banner-content flex-1">
          <h2
            className="banner-title mb-1"
            style={{ color: banner.text_color || '#fff', fontWeight: 700, fontSize: '18px' }}
          >
            {banner.title}
          </h2>
          {banner.subtitle && (
            <p
              className="banner-subtitle"
              style={{ color: banner.text_color ? banner.text_color + 'CC' : 'rgba(255,255,255,0.9)', fontSize: '14px' }}
            >
              {banner.subtitle}
            </p>
          )}
        </div>
        {banner.button_text && (
          <div className="banner-image relative">
            <div
              className="banner-badge flex items-center justify-center shadow-md animate-pulse"
              style={{
                background: banner.button_color || '#ffc107',
                color: banner.text_color ? banner.text_color : '#1a1a1a',
                fontSize: '20px',
                fontWeight: 700,
                width: '60px',
                height: '60px',
                borderRadius: '50%',
              }}
            >
              {banner.button_text}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
