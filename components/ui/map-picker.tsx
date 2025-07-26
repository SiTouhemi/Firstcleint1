"use client"

import React, { useCallback, useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { MapPin, Navigation, X, Check, Loader2, Search, Crosshair } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface MapPickerProps {
  onConfirm: (coords: { lat: number; lng: number; address?: string }) => void;
  onCancel: () => void;
  initialLocation?: { lat: number; lng: number };
  title?: string;
  subtitle?: string;
}

const defaultCenter = { lat: 24.7136, lng: 46.6753 }; // Riyadh

export const MapPicker: React.FC<MapPickerProps> = ({ 
  onConfirm, 
  onCancel, 
  initialLocation,
  title = "تحديد موقع التوصيل",
  subtitle = "اختر موقعك على الخريطة"
}) => {
  const [center, setCenter] = useState(initialLocation || defaultCenter);
  const [marker, setMarker] = useState(initialLocation || defaultCenter);
  const [loading, setLoading] = useState(true);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  const [following, setFollowing] = useState(false);
  const watchIdRef = React.useRef<number | null>(null);
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
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <X className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-900">خطأ في التكوين</CardTitle>
            <p className="text-sm text-gray-600">مفتاح خرائط Google غير متوفر</p>
          </CardHeader>
          <CardContent>
            <Button onClick={onCancel} className="w-full">
              إغلاق
            </Button>
          </CardContent>
        </Card>
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

  // Remove follow mode state/logic for this button

  // One-time current location handler
  const handleCurrentLocationButton = () => {
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

  // Handle follow mode
  const handleFollowLocation = () => {
    if (!following) {
      if (navigator.geolocation) {
        setGettingLocation(true);
        watchIdRef.current = navigator.geolocation.watchPosition(
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
        setFollowing(true);
      }
    } else {
      // Stop following
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setFollowing(false);
    }
  };

  // Clean up watchPosition on unmount
  React.useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 z-50">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 md:p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold">{title}</h2>
                <p className="text-blue-100 text-xs md:text-sm">{subtitle}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100">
          <form onSubmit={handleSearch} className="flex gap-2">
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
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              size="sm"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "بحث"
              )}
            </Button>
          </form>
        </div>

        {/* Map Container */}
        <div className="flex-1 p-4">
          <div className="relative h-full min-h-[300px] md:min-h-[400px]">
            <div className="h-full rounded-xl overflow-hidden border border-gray-200 shadow-lg">
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

            {/* One-time Current Location Button */}
            <button
              type="button"
              onClick={handleCurrentLocationButton}
              className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg border border-gray-200 bg-white hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 z-10"
              style={{ minWidth: 0 }}
              aria-pressed="false"
              title="موقعي"
            >
              {gettingLocation ? (
                <Loader2 className="w-4 h-4 animate-spin text-gray-900" />
              ) : (
                <Navigation className="w-4 h-4 text-gray-900" />
              )}
              <span className="hidden sm:inline text-sm font-medium text-gray-900">
                موقعي
              </span>
            </button>
          </div>

          {/* Location Info */}
          <div className="mt-4 space-y-3">
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
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-3">
            <Button
              onClick={() => onConfirm({ ...marker, address })}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
              size="lg"
            >
              <Check className="w-4 h-4 ml-2" />
              تأكيد الموقع
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 py-3"
              size="lg"
            >
              إلغاء
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPicker; 