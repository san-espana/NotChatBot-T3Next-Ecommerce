"use client"

import { createContext, useContext, useEffect, useState } from "react"

interface Product {
  id: string
  name: string
  description: string | null
  price: string
  image: string | null
}

interface ProductContextType {
  product: Product | null
  isLoading: boolean
  error: string | null
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch("/api/products")
        if (!response.ok) throw new Error("Failed to fetch product")
        const data = await response.json()
        setProduct(data[0]) // Assuming we want the first product
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    if (!product && !error) {
      fetchProduct()
    }
  }, [product, error])

  return (
    <ProductContext.Provider value={{ product, isLoading, error }}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProduct() {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error("useProduct must be used within a ProductProvider")
  }
  return context
} 