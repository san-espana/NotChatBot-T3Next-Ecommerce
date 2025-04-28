import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/server/db";
import { products } from "~/server/db/schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const allProducts = await db.select().from(products);
    return res.status(200).json(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
      details: error
    });
  }
} 