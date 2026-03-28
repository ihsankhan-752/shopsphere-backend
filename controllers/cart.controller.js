import { and, eq } from "drizzle-orm";
import db from "../db/index.js";
import { cartTable } from "../db/schema/cart.schema.js";
import { productsTable } from "../db/schema/product.schema.js";
import { error } from "console";

export const addProductToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const [existingProduct] = await db
      .select()
      .from(cartTable)
      .where(
        and(eq(cartTable.productId, productId), eq(cartTable.userId, userId)),
      );

    if (existingProduct) {
      await db
        .update(cartTable)
        .set({ count: existingProduct.count + 1 })
        .where(
          and(eq(cartTable.productId, productId), eq(cartTable.userId, userId)),
        );
      return res.status(201).json({ message: "Product Quantity Updated" });
    }

    await db.insert(cartTable).values({
      productId: productId,
      userId,
      count: 1,
    });

    return res.status(201).json({ message: "Product Added to Cart" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const getAllProductFromCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartProducts = await db
      .select({
        id: productsTable.id,
        title: productsTable.title,
        description: productsTable.description,
        price: productsTable.price,
        stock: productsTable.stock,
        image: productsTable.image,
        count: cartTable.count,
      })
      .from(cartTable)
      .where(eq(cartTable.userId, userId))
      .leftJoin(productsTable, eq(productsTable.id, cartTable.productId));

    return res.status(200).json({
      products: cartProducts,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, count } = req.body;

    if (count <= 0) {
      await db
        .delete(cartTable)
        .where(
          and(eq(cartTable.productId, productId), eq(cartTable.userId, userId)),
        );

      return res.status(200).json({ message: "Product Removed from Cart" });
    }

    await db
      .update(cartTable)
      .set({ count })
      .where(
        and(eq(cartTable.productId, productId), eq(cartTable.userId, userId)),
      );
    return res.status(200).json({ message: "Cart Updated" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    await db
      .delete(cartTable)
      .where(
        and(eq(cartTable.productId, productId), eq(cartTable.userId, userId)),
      );

    return res.status(200).json({ message: "Product removed from cart" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};
