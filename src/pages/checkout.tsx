"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Truck } from "lucide-react"
import Layout from "~/components/layout/Layout"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Card, CardContent } from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import { useProduct } from "~/context/ProductContext"

export default function CheckoutPage() {
  const router = useRouter()
  const { product, isLoading: isProductLoading, error: productError } = useProduct()
  const [quantity, setQuantity] = useState(1)
  const [postalCode, setPostalCode] = useState("")
  const [shippingCost, setShippingCost] = useState(0)
  const [isCalculating, setIsCalculating] = useState(false)

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return
    setQuantity(newQuantity)
  }

  // Calculate shipping cost
  const calculateShipping = (code: string) => {
    if (!code) return
    setIsCalculating(true)
    // Simple shipping calculation based on quantity
    const cost = quantity >= 3 ? 0 : 10 // Free shipping for 3 or more items
    setShippingCost(cost)
    setIsCalculating(false)
  }

  // Calculate total cost
  const totalCost = product ? (Number(product.price) * quantity + shippingCost).toFixed(2) : "0.00"

  if (isProductLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (productError || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-red-500">Error: {productError || "Product not found"}</div>
      </div>
    )
  }

  return (
    <Layout title="Checkout" description="Complete your purchase">
      <div className="container mx-auto px-4 pt-4 pb-16">
        <Button variant="ghost" className="mb-6 flex items-center gap-2 text-lg" onClick={() => router.push("/")}>
          <ArrowLeft className="h-5 w-5" />
          Back to Product
        </Button>
        <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Product and Quantity Section */}
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Your Order</h2>

                <div className="flex items-center gap-4">
                  <div className="relative h-24 w-24 overflow-hidden rounded-md">
                    <Image 
                      src={product.image || "/placeholder.svg"} 
                      alt={product.name} 
                      fill 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover" 
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-slate-500">Unit Price: ${product.price}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{quantity}</span>
                    <Button variant="outline" size="icon" onClick={() => handleQuantityChange(quantity + 1)}>
                      +
                    </Button>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Shipping Calculator */}
                <div>
                  <h2 className="mb-4 text-xl font-semibold">Shipping</h2>

                  <div className="mb-6">
                    <Label htmlFor="postalCode" className="mb-2 block">
                      Enter your postal code to calculate shipping
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="postalCode"
                        placeholder="Enter postal code"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                      />
                      <Button onClick={() => calculateShipping(postalCode)}>Calculate</Button>
                    </div>
                  </div>

                  {/* Shipping Information */}
                  <div className="rounded-lg bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="h-4 w-4 text-slate-500" />
                      <span>Shipping information</span>
                    </div>

                    {quantity >= 3 ? (
                      <div className="mt-2 rounded-md bg-green-50 p-3 text-sm text-green-700">
                        <strong>Free shipping!</strong> You qualify for free shipping with 3 or more copies.
                      </div>
                    ) : postalCode ? (
                      <div className="mt-2 text-sm">
                        <p>
                          Shipping cost to postal code <strong>{postalCode}</strong>:{" "}
                          <strong>${shippingCost.toFixed(2)}</strong>
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Add {3 - quantity} more {3 - quantity === 1 ? "copy" : "copies"} to qualify for free shipping!
                        </p>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">
                        Enter your postal code to see shipping costs. Free shipping on orders of 3 or more copies!
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">
                      Subtotal ({quantity} {quantity === 1 ? "item" : "items"})
                    </span>
                    <span>${(Number(product.price) * quantity).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-600">Shipping</span>
                    {isCalculating ? (
                      <span className="text-sm italic text-slate-500">Calculating...</span>
                    ) : (
                      <span>
                        {shippingCost === 0 && quantity >= 3 ? (
                          <span className="text-green-600">Free</span>
                        ) : postalCode ? (
                          `$${shippingCost.toFixed(2)}`
                        ) : (
                          <span className="text-sm italic text-slate-500">Enter postal code</span>
                        )}
                      </span>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>
                      {postalCode && !isCalculating ? (
                        `$${totalCost}`
                      ) : (
                        <span className="text-sm italic text-slate-500">Pending shipping</span>
                      )}
                    </span>
                  </div>
                </div>

                <Button className="mt-6 w-full" disabled={!postalCode || isCalculating}>
                  Proceed to Payment
                </Button>

                <p className="mt-4 text-center text-xs text-slate-500">
                  Secure payment processing. All data is encrypted.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
} 