# 1Stclient

A modern e-commerce platform built with Next.js, TypeScript, and Supabase.

## Features

### Location-Based Services

The platform includes a sophisticated "Close to Me" filter that:

1. **Exact GPS Location**: Uses browser's `navigator.geolocation.getCurrentPosition()` to get precise GPS coordinates
2. **Distance Calculation**: Uses Haversine formula for accurate distance calculation between user and stores
3. **Smart Filtering**: Only shows products from stores within their delivery range (typically 5-15km)
4. **Distance Display**: Shows distance in kilometers and sorts by nearest first
5. **City Detection**: Uses Google Maps Geocoding API (with fallback to hard-coded mapping)

#### How it Works:

1. **User Location**: When user enables "قريب مني" (Close to Me), the app requests GPS permission
2. **Store Locations**: Each store has GPS coordinates and delivery range stored in database
3. **Distance Calculation**: Calculates distance between user and each store using Haversine formula
4. **Filtering**: Only shows products from stores within delivery range
5. **Sorting**: Products are sorted by distance (nearest first)

#### Sample Store Locations:
- Riyadh Central: 24.7136, 46.6753 (15km delivery)
- Riyadh North: 24.8236, 46.6753 (10km delivery)  
- Riyadh South: 24.6036, 46.6753 (12km delivery)
- Jeddah Coast: 21.4858, 39.1925 (8km delivery)
- Dammam East: 26.4207, 50.0888 (10km delivery)

#### Technical Implementation:
- **Frontend**: React hooks for location management
- **Backend**: Distance calculation using Haversine formula
- **Database**: Store coordinates and delivery ranges
- **API**: Google Maps Geocoding for city detection
