export interface GeocodeResult {
  lat: number
  lng: number
  address: string
  formatted_address: string
}

export class GeocodingService {
  private static readonly GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY

  static async geocodeAddress(address: string): Promise<GeocodeResult | null> {
    if (!this.GOOGLE_MAPS_API_KEY) {
      console.warn("Google Maps API key not configured")
      return null
    }

    try {
      const encodedAddress = encodeURIComponent(address)
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${this.GOOGLE_MAPS_API_KEY}&language=ar&region=SA`

      const response = await fetch(url)
      const data = await response.json()

      if (data.status === "OK" && data.results.length > 0) {
        const result = data.results[0]
        return {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          address: address,
          formatted_address: result.formatted_address,
        }
      }

      console.warn("Geocoding failed:", data.status, data.error_message)
      return null
    } catch (error) {
      console.error("Geocoding error:", error)
      return null
    }
  }

  static async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    if (!this.GOOGLE_MAPS_API_KEY) {
      console.warn("Google Maps API key not configured")
      return null
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.GOOGLE_MAPS_API_KEY}&language=ar&region=SA`

      const response = await fetch(url)
      const data = await response.json()

      if (data.status === "OK" && data.results.length > 0) {
        return data.results[0].formatted_address
      }

      console.warn("Reverse geocoding failed:", data.status, data.error_message)
      return null
    } catch (error) {
      console.error("Reverse geocoding error:", error)
      return null
    }
  }

  static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1)
    const dLng = this.toRadians(lng2 - lng1)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }
}
