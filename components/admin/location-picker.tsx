"use client"

import React, { useCallback, useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { MapPin, Navigation, X, Check, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void
  initialLocation?: { lat: number; lng: number; address: string }
}

const defaultCenter = { lat: 24.7136, lng: 46.6753 }; // Riyadh

export function AdminLocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const [center, setCenter] = useState(initialLocation ? { lat: initialLocation.lat, lng: initialLocation.lng } : defaultCenter);
  const [marker, setMarker] = useState(initialLocation ? { lat: initialLocation.lat, lng: initialLocation.lng } : defaultCenter);
  const [loading, setLoading] = useState(true);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [address, setAddress] = useState<string>(initialLocation?.address || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  const mapRef = React.useRef<google.maps.Map | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey || '',
    language: 'ar',
    region: 'SA',
    libraries: ['places']
  });

  // Get address from coordinates
  const getAddressFromCoords = useCallback(async (lat: number, lng: number) => {
    if (!apiKey) return;
    
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&language=ar`
      );
      const data = await response.json();
      if (data.results && data.results[0]) {
        setAddress(data.results[0].formatted_address);
      }
    } catch (error) {
      console.error('Error getting address:', error);
    }
  }, [apiKey]);

  // Search for location
  const searchLocation = useCallback(async () => {
    if (!searchQuery.trim() || !apiKey) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchQuery)}&key=${apiKey}&language=ar&region=SA`
      );
      const data = await response.json();
      
      if (data.results && data.results[0]) {
        const location = data.results[0].geometry.location;
        const newCoords = { lat: location.lat, lng: location.lng };
        setCenter(newCoords);
        setMarker(newCoords);
        setAddress(data.results[0].formatted_address);
        toast({
          title: "تم العثور على الموقع",
          description: data.results[0].formatted_address,
        });
      } else {
        toast({
          title: "لم يتم العثور على الموقع",
          description: "يرجى التأكد من صحة العنوان",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ في البحث",
        description: "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, apiKey, toast]);

  // Check if API key is available
  if (!apiKey) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2">
          <X className="w-5 h-5 text-red-600" />
          <span className="text-red-800">مفتاح خرائط Google غير متوفر</span>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          if (!initialLocation) {
            setCenter(coords);
            setMarker(coords);
          }
          setLoading(false);
          getAddressFromCoords(coords.lat, coords.lng);
        },
        () => setLoading(false),
        { enableHighAccuracy: true }
      );
    } else {
      setLoading(false);
    }
  }, [getAddressFromCoords, initialLocation]);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newCoords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setMarker(newCoords);
      getAddressFromCoords(newCoords.lat, newCoords.lng);
    }
  }, [getAddressFromCoords]);

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setCenter(coords);
          setMarker(coords);
          getAddressFromCoords(coords.lat, coords.lng);
          setGettingLocation(false);
          if (mapRef.current) {
            mapRef.current.panTo(coords);
          }
          toast({
            title: "تم تحديد موقعك",
            description: "تم تحديد موقعك الحالي بنجاح",
          });
        },
        () => {
          setGettingLocation(false);
          toast({
            title: "خطأ في تحديد الموقع",
            description: "تأكد من السماح بالوصول لموقعك",
            variant: "destructive",
          });
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchLocation();
  };

  const handleConfirm = () => {
    onLocationSelect({
      lat: marker.lat,
      lng: marker.lng,
      address: address || "موقع المتجر",
    });
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="ابحث عن عنوان أو مكان..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>
        <Button
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
          size="sm"
        >
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "بحث"
          )}
        </Button>
        <Button
          onClick={handleCurrentLocation}
          disabled={gettingLocation}
          variant="outline"
          size="sm"
        >
          {gettingLocation ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Map Container */}
      <div className="relative h-96 rounded-xl overflow-hidden border border-gray-200 shadow-lg">
        {isLoaded && !loading ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={center}
            zoom={15}
            onClick={handleMapClick}
            onLoad={map => { mapRef.current = map; }}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              gestureHandling: 'greedy',
              zoomControl: true,
              styles: [
                {
                  featureType: 'poi',
                  elementType: 'labels',
                  stylers: [{ visibility: 'off' }]
                }
              ]
            }}
          >
            <Marker
              position={marker}
              draggable
              onDragEnd={(e) => {
                if (e.latLng) {
                  const newCoords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
                  setMarker(newCoords);
                  getAddressFromCoords(newCoords.lat, newCoords.lng);
                }
              }}
              icon={{
                url: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2_hdpi.png',
                scaledSize: new window.google.maps.Size(40, 40),
              }}
            />
          </GoogleMap>
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-gray-600">جاري تحميل الخريطة...</p>
            </div>
          </div>
        )}
      </div>

      {/* Location Info */}
      <div className="space-y-3">
        {/* Coordinates */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs">
            {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}
          </Badge>
        </div>

        {/* Address */}
        {address && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700 leading-relaxed">{address}</p>
            </div>
          </div>
        )}

        {/* Confirm Button */}
        <Button
          onClick={handleConfirm}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
          size="lg"
        >
          <Check className="w-4 h-4 ml-2" />
          تأكيد موقع المتجر
        </Button>
      </div>
    </div>
  );
} 