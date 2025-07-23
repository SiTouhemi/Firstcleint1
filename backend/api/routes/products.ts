import { type NextRequest, NextResponse } from "next/server"
import { ProductService } from "../services/productService"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get("storeId")
    const categoryName = searchParams.get("category")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured")
    const city = searchParams.get("city")
    const latitude = searchParams.get("latitude")
    const longitude = searchParams.get("longitude")
    const nearbyOnly = searchParams.get("nearbyOnly") === "true"

    let categoryId: string | undefined = undefined
    if (categoryName) {
      // Look up category ID by name
      const { data: category, error } = await import("../config/database").then(({ supabase }) =>
        supabase.from("categories").select("id").eq("name", categoryName).single()
      )
      if (category && category.id) {
        categoryId = category.id
      }
    }

    const products = await ProductService.getProducts({
      storeId: storeId || undefined,
      categoryId,
      search: search || undefined,
      featured: featured === "true" ? true : undefined,
      city: city || undefined,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      nearbyOnly,
    })

    return NextResponse.json({ success: true, data: products })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const product = await ProductService.createProduct(body)
    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 })
  }
}
