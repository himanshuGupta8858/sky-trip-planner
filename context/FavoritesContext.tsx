"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

export interface FavoriteDestination {
  id: string
  name: string
  tagline?: string
  image: string
  rating?: number
  tags?: string[]
  bestTimeToVisit?: string
  suggestedDuration?: number
  description?: string
}

interface FavoritesContextType {
  favorites: FavoriteDestination[]
  addFavorite: (item: FavoriteDestination) => void
  removeFavorite: (id: string) => void
  toggleFavorite: (item: FavoriteDestination) => void
  isFavorite: (id: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

const STORAGE_KEY = 'skytrip_favorites'

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<FavoriteDestination[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setFavorites(JSON.parse(saved))
      }
    } catch (e) {
      console.error('Failed to load favorites from localStorage:', e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save to localStorage when favorites update
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
      } catch (e) {
        console.error('Failed to save favorites to localStorage:', e)
      }
    }
  }, [favorites, isLoaded])

  const addFavorite = (item: FavoriteDestination) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === item.id || f.name === item.name)) return prev
      return [...prev, item]
    })
  }

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id && f.name !== id))
  }

  const toggleFavorite = (item: FavoriteDestination) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === item.id || f.name === item.name)
      if (exists) {
        return prev.filter((f) => f.id !== item.id && f.name !== item.name)
      } else {
        return [...prev, item]
      }
    })
  }

  const isFavorite = (id: string) => {
    return favorites.some((f) => f.id === id || f.name === id)
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
