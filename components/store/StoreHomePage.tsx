import React, { useState, useEffect } from "react";
import SpecialOfferBanner from "../admin/SpecialOfferBanner";
import MainCategories from "./MainCategories";
import SubcategoryFilterBar from "./SubcategoryFilterBar";
import ProductGrid from "./ProductGrid";

export default function StoreHomePage() {
  const [mainCategories, setMainCategories] = useState<any[]>([]);
  const [selectedMain, setSelectedMain] = useState("");
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [selectedSub, setSelectedSub] = useState("all");
  const [products, setProducts] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Fetch main categories on mount
  useEffect(() => {
    setLoadingCategories(true);
    fetch("/api/categories?parent_id=null")
      .then(res => res.json())
      .then(data => {
        // Assume icon is an emoji or fallback
        const cats = (data.data || []).map((cat: any) => ({
          ...cat,
          emoji: cat.icon || "📦"
        }));
        setMainCategories(cats);
        if (cats.length > 0) setSelectedMain(cats[0].id);
      })
      .finally(() => setLoadingCategories(false));
  }, []);

  // Fetch subcategories when main category changes
  useEffect(() => {
    if (!selectedMain) return;
    fetch(`/api/categories?parent_id=${selectedMain}`)
      .then(res => res.json())
      .then(data => {
        const subs = (data.data || []).map((cat: any) => ({
          ...cat,
          emoji: cat.icon || "📦"
        }));
        setSubcategories([{ id: "all", name: "الكل" }, ...subs]);
        setSelectedSub("all");
      });
  }, [selectedMain]);

  // Fetch products when subcategory changes
  useEffect(() => {
    if (!selectedMain) return;
    setLoadingProducts(true);
    let url = `/api/products?category_id=${selectedMain}`;
    if (selectedSub !== "all") url += `&subcategory_id=${selectedSub}`;
    fetch(url)
      .then(res => res.json())
      .then(data => setProducts(data.data || []))
      .finally(() => setLoadingProducts(false));
  }, [selectedMain, selectedSub]);

  const handleToggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-2 sm:px-0">
      <div className="my-4">
        <SpecialOfferBanner />
      </div>
      <div className="mb-4">
        {loadingCategories ? (
          <div className="text-center py-8 text-gray-400">جاري تحميل الفئات...</div>
        ) : (
          <MainCategories
            categories={mainCategories}
            selectedId={selectedMain}
            onSelect={setSelectedMain}
          />
        )}
      </div>
      <div className="mb-4">
        <SubcategoryFilterBar
          subcategories={subcategories}
          selectedId={selectedSub}
          onSelect={setSelectedSub}
        />
      </div>
      {loadingProducts ? (
        <div className="text-center py-8 text-gray-400">جاري تحميل المنتجات...</div>
      ) : (
        <ProductGrid
          products={products.map((p: any) => ({ ...p, isFavorite: favoriteIds.includes(p.id) }))}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
    </div>
  );
} 