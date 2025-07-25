"use client"

import { useBanners } from "@/hooks/use-banners"
import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"

interface Banner {
  title?: string;
  offer_text?: string;
  badge_text?: string;
  background_color?: string;
  text_color?: string;
}

export function DynamicBanner() {
  const { banners, loading } = useBanners()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    direction: 'rtl' // RTL support
  })
  console.log(banners)
  // Track selected slide
  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }

    emblaApi.on('select', onSelect)
    onSelect()

    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi])

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    if (!emblaApi || banners.length <= 1) return

    const autoplay = setInterval(() => {
      emblaApi.scrollNext()
    }, 5000)

    return () => clearInterval(autoplay)
  }, [emblaApi, banners.length])

  // Filter and sort banners by is_active, date, and sort_order
  const now = new Date();
  const filteredBanners = (banners || [])
    .filter(b => b.is_active !== false)
    .filter(b => {
      const start = b.start_date ? new Date(b.start_date) : null;
      const end = b.end_date ? new Date(b.end_date) : null;
      return (!start || now >= start) && (!end || now <= end);
    })
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  // Use filteredBanners instead of banners
  const renderBanner = useCallback((banner: Banner) => {
    const isTailwindBg = typeof banner.background_color === 'string' && banner.background_color.startsWith('bg-');
    return (
      <div
        className={
          `relative flex flex-row-reverse items-center justify-between rounded-2xl p-5 min-h-[100px] w-full max-w-2xl mx-4 md:mx-auto overflow-hidden ` +
          (isTailwindBg ? banner.background_color : '')
        }
        style={
          isTailwindBg
            ? {}
            : { background: banner.background_color || 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)' }
        }
      >
        {/* Decorative circle as background */}
        <div className="absolute top-[-40px] right-[-40px] w-[150px] h-[150px] bg-white/10 rounded-full z-0" />
        {/* Badge */}
        {banner.badge_text && (
          <div className="flex-shrink-0 ml-4 rtl:ml-0 rtl:mr-4 z-10">
            <div
              className="bg-yellow-400 text-black font-bold text-lg w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-white"
              aria-label={banner.badge_text}
            >
              {banner.badge_text}
            </div>
          </div>
        )}
        {/* Text */}
        <div className="flex-1 text-right z-10">
          <h2
            className="text-white text-lg font-bold mb-1"
            style={{ color: banner.text_color || 'white' }}
          >
            {banner.title || 'عنوان افتراضي'}
          </h2>
          {banner.offer_text && (
            <p
              className="text-white/90 text-sm font-normal"
              style={{ color: banner.text_color ? banner.text_color + 'CC' : 'rgba(255,255,255,0.9)' }}
            >
              {banner.offer_text}
            </p>
          )}
        </div>
      </div>
    );
  }, []);

  if (loading) {
    return (
      <div className="py-5 mx-2 mt-6 md:mx-auto md:max-w-3xl rounded-2xl">
        <div className="bg-gray-200 rounded-xl p-5 animate-pulse h-24" />
      </div>
    )
  }

  if (filteredBanners.length === 0) {
    // Fallback to default demo content
    const defaultBanner: Banner = {
      title: "عروض خاصة",
      offer_text: "خصم يصل إلى 50% على جميع المنتجات",
      badge_text: "50%",
      background_color: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
      text_color: "white"
    }

    return (
      <div className="pl-5 pb-5 ml-2 mt-6 md:mx-auto md:max-w-3xl">
        {renderBanner(defaultBanner)}
      </div>
    )
  }

  // Single banner - no carousel needed
  if (filteredBanners.length === 1) {
    return (
      <div className="pl-5 pb-5 ml-2 mt-6 md:mx-auto md:max-w-3xl">
        {renderBanner(filteredBanners[0])}
      </div>
    )
  }

  // Multiple banners - use carousel
  return (
    <div className="pl-5 pb-5 ml-2 mt-6 md:mx-auto md:max-w-3xl">
      <div ref={emblaRef} className="overflow-hidden rounded-xl">
        <div className="flex rtl">
          {filteredBanners.map((banner, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0">
              {renderBanner(banner)}
            </div>
          ))}
        </div>
      </div>
      {/* Carousel indicators */}
      {filteredBanners.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {filteredBanners.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full border-none transition-all duration-300 ${index === selectedIndex ? 'bg-blue-600 scale-125' : 'bg-blue-300'}`}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
