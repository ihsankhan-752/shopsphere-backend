import { and, eq } from "drizzle-orm";
import db from "../db/index.js";
import { productsTable } from "../db/schema/product.schema.js";
import { wishlistTable } from "../db/schema/wishlist.schema.js";

export const addProductToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const [product] = await db
      .select({ id: productsTable.id })
      .from(productsTable)
      .where(eq(productsTable.id, productId));

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const [existingPdtInWishlist] = await db
      .select()
      .from(wishlistTable)
      .where(
        and(
          eq(wishlistTable.userId, userId),
          eq(wishlistTable.productId, productId),
        ),
      );

    if (existingPdtInWishlist) {
      return res.status(409).json({
        error: "Product already in wishlist",
      });
    }

    await db.insert(wishlistTable).values({
      userId,
      productId,
    });
    return res.status(201).json({ message: "Product Added to Wishlist" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const getWishlistProduct = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlistProducts = await db
      .select({
        id: productsTable.id,
        title: productsTable.title,
        description: productsTable.description,
        price: productsTable.price,
        stock: productsTable.stock,
        image: productsTable.image,
      })
      .from(wishlistTable) // Just we are using for filtering
      .where(eq(wishlistTable.userId, userId))
      .leftJoin(productsTable, eq(productsTable.id, wishlistTable.productId));

    return res.status(200).json({
      products: wishlistProducts,
    });
  } catch (e) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const deleteProductFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const pdtId = req.params.id;
    const result = await db
      .delete(wishlistTable)
      .where(
        and(
          eq(wishlistTable.productId, pdtId),
          eq(wishlistTable.userId, userId),
        ),
      )
      .returning({ productId: wishlistTable.productId });

    if (result.length === 0) {
      return res.status(404).json({ error: "No Product Found in wishlist" });
    }

    return res
      .status(200)
      .json({ message: `Product with ID ${result[0].productId} is deleted` });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete product" });
  }
};
