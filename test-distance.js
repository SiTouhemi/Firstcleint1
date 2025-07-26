// Test distance calculation
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return Math.round(distance * 10) / 10 // Round to 1 decimal place
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180)
}

// Test coordinates
const userLocation = { lat: 24.7136, lng: 46.6753 } // Riyadh center
const stores = [
  { name: "متجر الرياض الرئيسي", lat: 24.7136, lng: 46.6753, deliveryRange: 15 },
  { name: "متجر الرياض الشمالي", lat: 24.8236, lng: 46.6753, deliveryRange: 10 },
  { name: "متجر الرياض الجنوبي", lat: 24.6036, lng: 46.6753, deliveryRange: 12 },
  { name: "متجر جدة الساحل", lat: 21.4858, lng: 39.1925, deliveryRange: 8 },
  { name: "متجر الدمام الشرقي", lat: 26.4207, lng: 50.0888, deliveryRange: 10 }
]

console.log("Testing distance calculation:")
console.log(`User location: ${userLocation.lat}, ${userLocation.lng}`)
console.log("")

stores.forEach(store => {
  const distance = calculateDistance(userLocation.lat, userLocation.lng, store.lat, store.lng)
  const inRange = distance <= store.deliveryRange
  console.log(`${store.name}:`)
  console.log(`  Distance: ${distance}km`)
  console.log(`  Delivery range: ${store.deliveryRange}km`)
  console.log(`  In range: ${inRange ? '✅' : '❌'}`)
  console.log("")
}) 