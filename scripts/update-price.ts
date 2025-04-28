import { db } from "../src/server/db";
import { products } from "../src/server/db/schema";
import { eq } from "drizzle-orm";

async function updatePrice() {
  try {
    const result = await db
      .update(products)
      .set({ price: "250.00" })
      .where(eq(products.name, "Limited Edition"))
      .returning();

    console.log("Updated product:", result[0]);
  } catch (error) {
    console.error("Error updating price:", error);
  } finally {
    process.exit(0);
  }
}

updatePrice(); 