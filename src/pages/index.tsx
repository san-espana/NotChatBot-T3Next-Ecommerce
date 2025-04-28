"use client"

import { useProduct } from "~/context/ProductContext"
import Layout from "~/components/layout/Layout"
import Link from "next/link"

export default function Home() {
  const { product, isLoading, error } = useProduct()

  if (isLoading) {
    return (
      <Layout title="Products" description="View our products">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="text-xl font-medium text-gray-600">Loading products...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !product) {
    return (
      <Layout title="Products" description="View our products">
        <div className="text-center text-red-500">Error: {error || "Products not found"}</div>
      </Layout>
    )
  }

  return (
    <Layout title="Products" description="View our products">
      <div className="mb-24">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
          <div className="flex flex-col justify-center md:order-1">
            <div className="mb-6 inline-block rounded-full bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm">
              Limited Edition
            </div>

            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {product.name}
            </h1>

            <p className="mb-8 text-lg text-slate-600">{product.description}</p>

            <div className="mb-8 flex items-baseline">
              <span className="text-4xl font-bold">${product.price}</span>
              <span className="ml-2 text-sm text-slate-500">USD</span>
            </div>

            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Link 
                href="/checkout"
                className="h-12 rounded-lg bg-gray-900 px-8 text-base font-semibold text-white shadow-lg hover:bg-gray-800 hover:scale-105 transition-all duration-200 flex items-center justify-center"
              >
                Buy it now!
              </Link>
              <a 
                href="https://nextjs.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-12 rounded-lg border-2 border-gray-300 bg-white px-8 text-base font-semibold text-gray-700 shadow-lg hover:bg-gray-100 hover:scale-105 hover:border-gray-400 transition-all duration-200 flex items-center justify-center"
              >
                Learn More
              </a>
            </div>

            <div className="mt-8 flex items-center">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-5 w-5 text-primary"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
                <span className="text-sm font-medium">2-Year Warranty</span>
              </div>
            </div>
          </div>

          <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100 md:order-2 md:w-[90%] md:mx-auto">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="mt-24">
          <h2 className="mb-16 text-center text-4xl font-bold tracking-tight">What's Included</h2>
          <div className="grid gap-12 md:grid-cols-3">
            <div className="rounded-xl bg-white p-8 shadow-lg hover:scale-105 transition-all duration-200">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f4f6]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-gray-700"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.29 7 12 12 20.71 7" />
                  <line x1="12" x2="12" y1="22" y2="12" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold">Beautiful Box</h3>
              <p className="text-slate-600">Elegantly designed packaging that looks great on any developer's shelf.</p>
            </div>
            <div className="rounded-xl bg-white p-8 shadow-lg hover:scale-105 transition-all duration-200">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f4f6]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-gray-700"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" x2="12" y1="3" y2="15" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold">USB Drive</h3>
              <p className="text-slate-600">
                Contains the complete source code and documentation for your Next.js app.
              </p>
            </div>
            <div className="rounded-xl bg-white p-8 shadow-lg hover:scale-105 transition-all duration-200">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f4f6]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-gray-700"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M7 7h.01" />
                  <path d="M17 7h.01" />
                  <path d="M7 17h.01" />
                  <path d="M17 17h.01" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold">Certificate</h3>
              <p className="text-slate-600">A certificate of authenticity signed by the Next.js team.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
