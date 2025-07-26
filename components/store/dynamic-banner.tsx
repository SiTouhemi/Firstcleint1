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
  subtitle?: string;
  description?: string;
  button_text?: string;
  button_color?: string;
  button_link?: string;
  image_url?: string;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
  sort_order?: number;
}

interface DynamicBannerProps {
  pcMode?: boolean;
}

export function DynamicBanner({ pcMode = false }: DynamicBannerProps) {
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
  const renderBanner = useCallback((banner: Banner, index: number) => {
    const isTailwindBg = typeof banner.background_color === 'string' && (banner.background_color || '').startsWith('bg-');
    const background = isTailwindBg ? {} : { background: banner.background_color || 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)' };
    const isTailwindClass = isTailwindBg && (banner.background_color || '').startsWith('bg-');

    // Responsive container: full width on desktop, max-w-4xl on mobile/tablet
    // If pcMode is true, use w-screen and remove max-w-4xl on md+
    const containerClass = pcMode
      ? `flex flex-row-reverse items-center rounded-xl p-3 md:p-4 lg:p-5 relative overflow-hidden w-full max-w-6xl mx-4 md:mx-auto px-2 md:px-6 lg:px-8` + (isTailwindClass ? ` ${banner.background_color}` : '')
      : `flex flex-row-reverse items-center rounded-xl p-3 md:p-4 lg:p-5 relative overflow-hidden w-full max-w-4xl mx-4 md:mx-auto px-2 md:px-6 lg:px-8` + (isTailwindClass ? ` ${banner.background_color}` : '');

    return (
      <div
        key={index}
        className={containerClass}
        style={{ ...background, minHeight: '56px' }}
      >
        {/* Decorative circle as background */}
        <div className="absolute top-[-30px] right-[-30px] w-[90px] h-[90px] bg-white/10 rounded-full z-0" />
        {/* Badge */}
        {banner.badge_text && (
          <div className="flex-shrink-0 ml-2 rtl:ml-0 rtl:mr-2 z-10" style={{ transform: 'translateX(15px)' }}>
            <div
              className="bg-yellow-400 text-black font-bold text-lg w-14 h-14 rounded-full flex items-center justify-center shadow-md border-2 border-white"
              style={{
                animation: 'pulse-grow 2s ease-in-out infinite'
              }}
              aria-label={banner.badge_text}
            >
              {banner.badge_text}
            </div>
          </div>
        )}
        {/* Banner Image (if present) */}
        {banner.image_url && (
          <div className="hidden md:block flex-shrink-0 mr-2 rtl:mr-0 rtl:ml-2 z-10">
            <img src={banner.image_url} alt={banner.title || ''} className="w-16 h-16 object-cover rounded-lg shadow-sm" />
          </div>
        )}
        {/* Text */}
        <div className="flex-1 text-right z-10">
          <h2
            className="text-white text-base md:text-lg font-bold mb-0.5"
            style={{ color: banner.text_color || 'white', lineHeight: 1.2 }}
          >
            {banner.title || 'عنوان افتراضي'}
          </h2>
          {banner.subtitle && (
            <div className="text-white/90 text-xs md:text-sm font-normal mb-0.5" style={{ color: banner.text_color ? banner.text_color + 'CC' : 'rgba(255,255,255,0.9)' }}>{banner.subtitle}</div>
          )}
          {banner.offer_text && (
            <p
              className="text-white/90 text-xs md:text-sm font-normal mb-0.5"
              style={{ color: banner.text_color ? banner.text_color + 'CC' : 'rgba(255,255,255,0.9)' }}
            >
              {banner.offer_text}
            </p>
          )}
          {banner.description && (
            <div className="text-white/80 text-[10px] md:text-xs font-light mb-1" style={{ color: banner.text_color ? banner.text_color + '99' : 'rgba(255,255,255,0.7)' }}>{banner.description}</div>
          )}
          {/* Button */}
          {banner.button_text && (
            <a
              href={banner.button_link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-1 px-3 py-1.5 rounded-full font-bold shadow-sm transition-colors duration-200 text-sm md:text-base"
              style={{
                background: banner.button_color || '#ffc107',
                color: banner.text_color || '#1a1a1a',
                fontSize: '14px',
              }}
            >
              {banner.button_text}
            </a>
          )}
        </div>
      </div>
    );
  }, [pcMode]);

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
      <div className="pl-5 pb-5 ml-2 md:mx-auto md:max-w-3xl">
        {renderBanner(defaultBanner, 0)}
      </div>
    )
  }

  // Single banner - no carousel needed
  if (filteredBanners.length === 1) {
    return (
      <div className="pl-5 pb-5 ml-2 md:mx-auto md:max-w-3xl">
        {renderBanner(filteredBanners[0], 0)}
      </div>
    )
  }

  // Multiple banners - use carousel
  return (
    <div className="pl-5 pb-5 ml-2 md:mx-auto md:max-w-3xl">
      <div ref={emblaRef} className="overflow-hidden rounded-xl">
        <div className="flex rtl">
          {filteredBanners.map((banner, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0">
              {renderBanner(banner, index)}
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
