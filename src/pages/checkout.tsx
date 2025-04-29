"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Truck, X } from "lucide-react"
import Layout from "~/components/layout/Layout"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Card, CardContent } from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import { useProduct } from "~/context/ProductContext"
import dynamic from "next/dynamic"

const ReactConfetti = dynamic(() => import('react-confetti'), {
  ssr: false
})

export default function CheckoutPage() {
  const router = useRouter()
  const { product, isLoading: isProductLoading, error: productError } = useProduct()
  const [quantity, setQuantity] = useState(1)
  const [postalCode, setPostalCode] = useState("")
  const [shippingCost, setShippingCost] = useState(0)
  const [isCalculating, setIsCalculating] = useState(false)
  const [allZipCodes, setAllZipCodes] = useState<any[]>([])
  const [currentProvince, setCurrentProvince] = useState<string | null>(null)
  const [isZipCodeValid, setIsZipCodeValid] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Fetch all zip codes on component mount
  useEffect(() => {
    const fetchZipCodes = async () => {
      try {
        const response = await fetch('/api/zipcodes')
        const data = await response.json()
        setAllZipCodes(data)
      } catch (error) {
        console.error('Error fetching zip codes:', error)
      }
    }
    fetchZipCodes()
  }, [])

  // Validate zipcode on change
  useEffect(() => {
    const isValid = /^\d{4}$/.test(postalCode)
    setIsZipCodeValid(isValid)
    if (!isValid) {
      setCurrentProvince(null)
      setShippingCost(0)
    }
  }, [postalCode])

  // Calculate shipping cost
  const calculateShipping = (currentQuantity: number = quantity) => {
    if (!isZipCodeValid) return
    
    const zipCodeNum = parseInt(postalCode)
    const matchingZone = allZipCodes.find(
      zone => zipCodeNum >= zone.minimum && zipCodeNum <= zone.maximum
    )

    if (matchingZone) {
      setCurrentProvince(matchingZone.province)
      
      // Calculate shipping cost based on zone
      let cost = 0
      switch (matchingZone.zone) {
        case 1:
          cost = 1000
          break
        case 2:
          cost = 5000
          break
        case 3:
          cost = 15000
          break
        case 4:
          cost = 25000
          break
      }

      // Check if total product value exceeds 30000 for free shipping
      const totalProductValue = Number(product?.price || 0) * currentQuantity
      setShippingCost(totalProductValue > 30000 ? 0 : cost)
    } else {
      // Find the nearest range
      const nearestZone = allZipCodes.reduce((nearest, current) => {
        const currentMinDistance = Math.min(
          Math.abs(zipCodeNum - current.minimum),
          Math.abs(zipCodeNum - current.maximum)
        )
        const nearestMinDistance = Math.min(
          Math.abs(zipCodeNum - nearest.minimum),
          Math.abs(zipCodeNum - nearest.maximum)
        )
        return currentMinDistance < nearestMinDistance ? current : nearest
      })

      setCurrentProvince(nearestZone.province)
      
      // Calculate shipping cost based on nearest zone
      let cost = 0
      switch (nearestZone.zone) {
        case 1:
          cost = 1000
          break
        case 2:
          cost = 5000
          break
        case 3:
          cost = 15000
          break
        case 4:
          cost = 25000
          break
      }

      // Check if total product value exceeds 30000 for free shipping
      const totalProductValue = Number(product?.price || 0) * quantity
      setShippingCost(totalProductValue > 30000 ? 0 : cost)
    }
  }

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return
    setQuantity(newQuantity)

    // Only calculate if we have a valid zipcode and shipping is not free
    const newTotalValue = product ? Number(product.price) * newQuantity : 0
    if (isZipCodeValid && newTotalValue <= 30000) {
      calculateShipping(newQuantity)
    }
  }

  // Calculate total cost and check for free shipping
  const totalProductValue = product ? Number(product.price) * quantity : 0
  const isFreeShipping = totalProductValue > 30000
  const totalCost = product ? (totalProductValue + (isFreeShipping ? 0 : shippingCost)).toFixed(2) : "0.00"

  const handleProceedToPayment = () => {
    setShowConfetti(true)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setShowConfetti(false)
  }

  if (isProductLoading) {
    return (
      <Layout title="Checkout" description="Complete your purchase">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="text-xl font-medium text-gray-600">Loading checkout...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (productError || !product) {
    return (
      <Layout title="Checkout" description="Complete your purchase">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center text-red-500">Error: {productError || "Product not found"}</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Checkout" description="Complete your purchase">
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}
      
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={handleCloseModal}
        >
          <div 
            className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-100"
              onClick={handleCloseModal}
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="mb-4 text-2xl font-bold text-center">This is the end of the Demo!</h2>
            <p className="text-center text-gray-600">
              Thank you for trying out our checkout process. This is a demonstration of our e-commerce platform.
            </p>
            <div className="my-4 text-center">
              <p className="text-lg font-semibold text-primary">
                You were about to spend <span className="text-2xl font-bold">${totalCost}</span> on a Next.js app!
              </p>
              <p className="mt-2 text-sm text-gray-500">Be proud of your purchase! 🚀</p>
            </div>
            <div className="mt-6 flex justify-center">
              <Button 
                onClick={() => router.push("/")}
                className="bg-primary hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      )}

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
                    <div className="flex flex-col gap-2">
                      <Input
                        id="postalCode"
                        placeholder="Enter 4-digit postal code"
                        value={postalCode}
                        onChange={(e) => {
                          const newValue = e.target.value.replace(/\D/g, '') // Only allow numbers
                          setPostalCode(newValue)
                          
                          // Calculate immediately when 4 digits are entered
                          if (newValue.length === 4) {
                            const zipCodeNum = parseInt(newValue)
                            const matchingZone = allZipCodes.find(
                              zone => zipCodeNum >= zone.minimum && zipCodeNum <= zone.maximum
                            )

                            if (matchingZone) {
                              setCurrentProvince(matchingZone.province)
                              
                              // Calculate shipping cost based on zone
                              let cost = 0
                              switch (matchingZone.zone) {
                                case 1:
                                  cost = 1000
                                  break
                                case 2:
                                  cost = 5000
                                  break
                                case 3:
                                  cost = 15000
                                  break
                                case 4:
                                  cost = 25000
                                  break
                              }

                              // Check if total product value exceeds 30000 for free shipping
                              const totalProductValue = Number(product?.price || 0) * quantity
                              setShippingCost(totalProductValue > 30000 ? 0 : cost)
                            } else {
                              // Find the nearest range
                              const nearestZone = allZipCodes.reduce((nearest, current) => {
                                const currentMinDistance = Math.min(
                                  Math.abs(zipCodeNum - current.minimum),
                                  Math.abs(zipCodeNum - current.maximum)
                                )
                                const nearestMinDistance = Math.min(
                                  Math.abs(zipCodeNum - nearest.minimum),
                                  Math.abs(zipCodeNum - nearest.maximum)
                                )
                                return currentMinDistance < nearestMinDistance ? current : nearest
                              })

                              setCurrentProvince(nearestZone.province)
                              
                              // Calculate shipping cost based on nearest zone
                              let cost = 0
                              switch (nearestZone.zone) {
                                case 1:
                                  cost = 1000
                                  break
                                case 2:
                                  cost = 5000
                                  break
                                case 3:
                                  cost = 15000
                                  break
                                case 4:
                                  cost = 25000
                                  break
                              }

                              // Check if total product value exceeds 30000 for free shipping
                              const totalProductValue = Number(product?.price || 0) * quantity
                              setShippingCost(totalProductValue > 30000 ? 0 : cost)
                            }
                          } else {
                            setCurrentProvince(null)
                            setShippingCost(0)
                          }
                        }}
                        maxLength={4}
                        pattern="\d*"
                      />
                      <p className="text-sm text-slate-500">
                        Please enter exactly 4 numbers for your postal code
                      </p>
                    </div>
                  </div>

                  {/* Shipping Information */}
                  <div className="rounded-lg bg-slate-50 p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="h-4 w-4 text-slate-500" />
                      <span>Shipping information</span>
                    </div>

                    {isFreeShipping ? (
                      <div className="mt-2 rounded-md bg-green-50 p-3 text-sm text-green-700">
                        <strong>Free shipping!</strong> Your order exceeds $30,000
                      </div>
                    ) : currentProvince ? (
                      <div className="mt-2 text-sm">
                        <p>
                          Shipping to <strong>{currentProvince}</strong>:{" "}
                          <strong>${shippingCost.toFixed(2)}</strong>
                        </p>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-slate-500">
                        Enter a valid 4-digit postal code to see shipping costs
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
                    {isFreeShipping ? (
                      <span className="text-green-600">Free</span>
                    ) : isCalculating ? (
                      <span className="text-sm italic text-slate-500">Calculating...</span>
                    ) : currentProvince ? (
                      `$${shippingCost.toFixed(2)}`
                    ) : (
                      <span className="text-sm italic text-slate-500">Enter postal code</span>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>
                      {isFreeShipping ? (
                        `$${totalCost}`
                      ) : currentProvince && !isCalculating ? (
                        `$${totalCost}`
                      ) : (
                        <span className="text-sm italic text-slate-500">Pending shipping</span>
                      )}
                    </span>
                  </div>
                </div>

                <Button 
                  className="mt-6 w-full transition-transform duration-300 hover:scale-105 active:scale-95" 
                  disabled={!isFreeShipping && (!currentProvince || isCalculating)}
                  onClick={handleProceedToPayment}
                >
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