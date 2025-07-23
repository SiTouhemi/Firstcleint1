"use client"

import { useState } from "react"
import { MapPin, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function LocationsManagement() {
  const [cities, setCities] = useState([
    {
      id: "1",
      name: "الرياض",
      districts: ["مصر الجديدة", "المعادي", "الزمالك", "وسط البلد", "مدينة نصر", "الدقي"],
    },
    {
      id: "2",
      name: "الجيزة",
      districts: ["الهرم", "المهندسين", "العجوزة", "الدقي", "6 أكتوبر"],
    },
    {
      id: "3",
      name: "الإسكندرية",
      districts: ["سموحة", "الإبراهيمية", "كامب شيزار", "الأزاريطة", "ميامي"],
    },
    {
      id: "4",
      name: "أسوان",
      districts: ["وسط المدينة", "الجزيرة", "الكورنيش"],
    },
    {
      id: "5",
      name: "الأقصر",
      districts: ["البر الشرقي", "البر الغربي", "الكرنك"],
    },
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            إدارة المواقع
          </h1>
          <p className="text-gray-600 mt-1">إدارة المدن والأحياء المتاحة للتوصيل</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          إضافة مدينة جديدة
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cities.map((city) => (
          <Card key={city.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  {city.name}
                </CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">{city.districts.length} حي متاح</p>

                <div className="max-h-32 overflow-y-auto">
                  <div className="flex flex-wrap gap-1">
                    {city.districts.map((district, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {district}
                      </span>
                    ))}
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <Plus className="h-3 w-3 mr-1" />
                  إضافة حي جديد
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
