"use client"

import { useState } from "react"
import { Package, Plus, Edit, Trash2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export function ProductsManagement() {
  const [products, setProducts] = useState([])
  const [stores, setStores] = useState([])
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    store_id: "",
    category_id: "",
    subcategory_id: "",
    unit: "",
    description: "",
    image_url: "",
    is_active: true,
  })

  useEffect(() => {
    fetchProducts()
    fetchStores()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      if (data.success) {
        setProducts(data.data)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({ title: "خطأ", description: "حدث خطأ أثناء جلب المنتجات", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const fetchStores = async () => {
    try {
      const response = await fetch("/api/stores")
      const data = await response.json()
      if (data.success) {
        setStores(data.data)
      }
    } catch (error) {
      console.error("Error fetching stores:", error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف المنتج؟")) return
    try {
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" })
      const data = await response.json()
      if (data.success) {
        toast({ title: "تم الحذف", description: "تم حذف المنتج بنجاح" })
        fetchProducts()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({ title: "خطأ", description: "حدث خطأ أثناء الحذف", variant: "destructive" })
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      price: product.price,
      store_id: product.store_id || "",
      category_id: product.category_id || "",
      subcategory_id: product.subcategory_id || "",
      unit: product.unit || "",
      description: product.description || "",
      image_url: product.image_url || "",
      is_active: product.is_active !== undefined ? product.is_active : true,
    })
    setShowDialog(true)
  }

  const handleCreate = () => {
    setEditingProduct(null)
    setFormData({
      name: "",
      price: 0,
      store_id: "",
      category_id: "",
      subcategory_id: "",
      unit: "",
      description: "",
      image_url: "",
      is_active: true,
    })
    setShowDialog(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.store_id || !formData.category_id) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى اختيار المتجر والفئة",
        variant: "destructive",
      })
      return
    }
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products"
      const method = editingProduct ? "PUT" : "POST"
      const payload = {
        name: formData.name,
        price: formData.price,
        store_id: formData.store_id,
        category_id: formData.category_id,
        subcategory_id: formData.subcategory_id || null,
        unit: formData.unit,
        description: formData.description,
        image_url: formData.image_url,
        is_active: formData.is_active,
      }
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (data.success) {
        toast({
          title: editingProduct ? "تم التحديث" : "تم الإنشاء",
          description: editingProduct ? "تم تحديث المنتج بنجاح" : "تم إنشاء المنتج بنجاح"
        })
        setShowDialog(false)
        setEditingProduct(null)
        fetchProducts()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({ title: "خطأ", description: "حدث خطأ أثناء الحفظ", variant: "destructive" })
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category?.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Add this function for uploading to imgbb
  const IMGBB_API_KEY = "e3ed25911ada746cffe7d72034fee94f";
  const IMGBB_ALBUM = "client1";

  async function uploadToImgbb(file) {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("album", IMGBB_ALBUM);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error("Image upload failed");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-6 w-6" />
            إدارة المنتجات
          </h1>
          <p className="text-gray-600 mt-1">إدارة منتجات المتجر</p>
        </div>
        <Button onClick={handleCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          إضافة منتج جديد
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="البحث في المنتجات..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(product)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700" onClick={() => handleDelete(product.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {product.image_url && (
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">
                    {product.price} ر.س{product.unit && `/${product.unit}`}
                  </span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{product.category?.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج <span className="text-red-500">*</span></label>
                <Input value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">السعر <span className="text-red-500">*</span></label>
                <Input type="number" step="0.01" value={formData.price} onChange={e => setFormData(f => ({ ...f, price: Number(e.target.value) }))} required />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المتجر <span className="text-red-500">*</span></label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={formData.store_id} 
                  onChange={e => setFormData(f => ({ ...f, store_id: e.target.value }))}
                  required
                >
                  <option value="">اختر المتجر</option>
                  {stores.map(store => (
                    <option key={store.id} value={store.id}>{store.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الفئة <span className="text-red-500">*</span></label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={formData.category_id} 
                  onChange={e => setFormData(f => ({ ...f, category_id: e.target.value }))}
                  required
                >
                  <option value="">اختر الفئة</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الفئة الفرعية</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={formData.subcategory_id} 
                  onChange={e => setFormData(f => ({ ...f, subcategory_id: e.target.value }))}
                >
                  <option value="">اختر الفئة الفرعية (اختياري)</option>
                  {categories.filter(cat => cat.parent_id).map(subcategory => (
                    <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الوحدة</label>
                <Input value={formData.unit} onChange={e => setFormData(f => ({ ...f, unit: e.target.value }))} placeholder="كيلو، قطعة، لتر..." />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
              <Textarea value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} rows={3} />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">صورة المنتج</label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  try {
                    const url = await uploadToImgbb(file);
                    setFormData((f) => ({ ...f, image_url: url }));
                  } catch (err) {
                    alert("Image upload failed");
                  }
                }}
              />
              {formData.image_url && (
                <img src={formData.image_url} alt="Preview" style={{ maxWidth: 200, marginTop: 8 }} />
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نشط</label>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={e => setFormData(f => ({ ...f, is_active: e.target.checked }))}
                className="h-5 w-5"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)} className="flex-1">إلغاء</Button>
              <Button type="submit" className="flex-1">{editingProduct ? "تحديث المنتج" : "إنشاء المنتج"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد منتجات</h3>
          <p className="text-gray-600">لم يتم العثور على منتجات تطابق البحث</p>
        </div>
      )}
    </div>
  )
}
