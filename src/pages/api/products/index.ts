import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/server/db";
import { products } from "~/server/db/schema";
import { desc } from "drizzle-orm"; 

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const lastProduct  = await db.select().from(products).orderBy(desc(products.id)) // Assuming 'id' is the primary key
    .limit(1);
    return res.status(200).json(lastProduct);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
      details: error
    });
  }
} 