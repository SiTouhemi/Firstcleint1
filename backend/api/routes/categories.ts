import { type NextRequest, NextResponse } from "next/server"
import { CategoryService } from "../services/categoryService"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get("storeId")

    // storeId is now optional
    const categories = await CategoryService.getCategories(storeId || undefined)
    return NextResponse.json({ success: true, data: categories })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const category = await CategoryService.createCategory(body)
    return NextResponse.json({ success: true, data: category })
  } catch (error: any) {
    console.error("Error creating category:", error)
    // Return the actual error message if available
    return NextResponse.json({ success: false, error: error?.message || error?.toString() || "Failed to create category" }, { status: 500 })
  }
}
