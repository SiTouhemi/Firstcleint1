"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface FavoritesStore {
  favorites: string[]
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  clearFavorites: () => void
}

export const useFavorites = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (productId) => {
        set((state) => {
          const isFavorite = state.favorites.includes(productId)
          if (isFavorite) {
            return {
              favorites: state.favorites.filter((id) => id !== productId),
            }
          }
          return {
            favorites: [...state.favorites, productId],
          }
        })
      },

      isFavorite: (productId) => {
        return get().favorites.includes(productId)
      },

      clearFavorites: () => {
        set({ favorites: [] })
      },
    }),
    {
      name: "favorites-storage",
    },
  ),
)
