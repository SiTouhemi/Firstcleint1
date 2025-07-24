export declare const supabase: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
export default supabase;
export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    compare_price?: number;
    discount?: number;
    image_url?: string;
    is_active: boolean;
    available: boolean;
    stock_quantity: number;
    unit?: string;
    category_id?: string;
    store_id: string;
    is_featured?: boolean;
    city?: string;
    created_at?: string;
    updated_at?: string;
}
export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image_url?: string;
    is_active: boolean;
    sort_order?: number;
    parent_id?: string;
    created_at?: string;
    updated_at?: string;
}
export interface Store {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image_url?: string;
    location_lat?: number;
    location_lng?: number;
    address?: string;
    city?: string;
    phone?: string;
    email?: string;
    delivery_range?: number;
    is_active: boolean;
    theme_color?: string;
    created_at?: string;
    updated_at?: string;
}
export interface Banner {
    id: string;
    title: string;
    description?: string;
    image_url: string;
    link_url?: string;
    is_active: boolean;
    sort_order?: number;
    created_at?: string;
    updated_at?: string;
}
//# sourceMappingURL=database.d.ts.map