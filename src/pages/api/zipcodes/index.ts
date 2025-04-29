import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/server/db";
import { zipCodes } from "~/server/db/schema";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const allZipCodes = await db.select().from(zipCodes);
    return res.status(200).json(allZipCodes);
  } catch (error) {
    console.error("Error fetching zip codes:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
} 