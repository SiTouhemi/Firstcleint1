import express from "express"

// Google Maps Geocoding API response types
interface GoogleMapsGeocodingResponse {
  results: Array<{
    address_components: Array<{
      long_name: string
      short_name: string
      types: string[]
    }>
    formatted_address: string
  }>
  status: string
}

const router = express.Router()

router.get("/reverse-geocode", async (req, res) => {
  try {
    const { lat, lng } = req.query

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: "Latitude and longitude are required",
      })
    }

    const latitude = Number.parseFloat(lat as string)
    const longitude = Number.parseFloat(lng as string)

    // Try Google Maps Geocoding API first
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY
    
    if (googleMapsApiKey) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsApiKey}&language=ar`
        )
        
        if (response.ok) {
          const data = await response.json() as GoogleMapsGeocodingResponse
          
          if (data.results && data.results.length > 0) {
            // Extract city name from Google Maps response
            const addressComponents = data.results[0].address_components
            let city = "غير محدد"
            
            // Look for administrative_area_level_1 (state/province) or locality (city)
            for (const component of addressComponents) {
              if (component.types.includes('administrative_area_level_1') || 
                  component.types.includes('locality')) {
                city = component.long_name
                break
              }
            }
            
            return res.json({
              success: true,
              city,
              coordinates: { latitude, longitude },
              address: data.results[0].formatted_address
            })
          }
        }
      } catch (error) {
        console.warn("Google Maps API failed, falling back to hard-coded mapping:", error)
      }
    }

    // Fallback to hard-coded mapping for Saudi Arabia
    let city = "غير محدد"

    // Riyadh area
    if (latitude >= 24.4 && latitude <= 24.9 && longitude >= 46.3 && longitude <= 47.0) {
      city = "الرياض"
    }
    // Jeddah area
    else if (latitude >= 21.3 && latitude <= 21.8 && longitude >= 39.0 && longitude <= 39.4) {
      city = "جدة"
    }
    // Dammam area
    else if (latitude >= 26.3 && latitude <= 26.5 && longitude >= 49.9 && longitude <= 50.2) {
      city = "الدمام"
    }
    // Mecca area
    else if (latitude >= 21.3 && latitude <= 21.5 && longitude >= 39.7 && longitude <= 40.0) {
      city = "مكة المكرمة"
    }
    // Medina area
    else if (latitude >= 24.4 && latitude <= 24.5 && longitude >= 39.5 && longitude <= 39.7) {
      city = "المدينة المنورة"
    }

    res.json({
      success: true,
      city,
      coordinates: {
        latitude,
        longitude,
      },
    })
  } catch (error) {
    console.error("Error in reverse geocoding:", error)
    res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
})

export default router
