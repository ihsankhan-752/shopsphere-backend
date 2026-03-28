import db from "../db/index.js";
import { productsTable } from "../db/schema/product.schema.js";
import { z } from "zod";
import { productValidation } from "../validations/product.validation.js";
import { categoriesTable } from "../db/schema/categories.schema.js";
import { eq, ilike, and, gte, lte } from "drizzle-orm";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const addProduct = async (req, res) => {
  try {
    const pdtValidationRes = await productValidation.safeParseAsync(req.body);

    if (!pdtValidationRes.success) {
      const error = z.treeifyError(pdtValidationRes.error);
      return res.status(400).json({ error: error });
    }

    const { title, description, price, stock, categoryId } =
      pdtValidationRes.data;

    if (!req.file) {
      return res.status(400).json({ error: "Product image is missing" });
    }

    const [category] = await db
      .select({ id: categoriesTable.id })
      .from(categoriesTable)
      .where(eq(categoriesTable.id, categoryId));

    if (!category) {
      return res.status(404).json({ error: "No Category Exist" });
    }

    const result = await uploadToCloudinary(req.file.buffer, "products");

    const [newPdt] = await db
      .insert(productsTable)
      .values({
        title,
        description,
        price: price.toString(),
        stock,
        categoryId: category.id,
        image: result.secure_url,
      })
      .returning({ id: productsTable.id });

    return res.status(201).json({ message: "Product Added", id: newPdt.id });
  } catch (e) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const getAllProducts = async (req, res) => {
  const { search, minPrice, maxPrice } = req.query;
  try {
    const products = await db
      .select({
        id: productsTable.id,
        title: productsTable.title,
        description: productsTable.description,
        price: productsTable.price,
        stock: productsTable.stock,
        categoryId: productsTable.categoryId,
        image: productsTable.image,
      })
      .from(productsTable)
      .where(
        and(
          search ? ilike(productsTable.title, `%${search}%`) : undefined,
          minPrice ? gte(productsTable.price, minPrice) : undefined,
          maxPrice ? lte(productsTable.price, maxPrice) : undefined,
        ),
      );

    return res.status(200).json({ products });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch Products" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const pdtId = req.params.id;

    const pdt = await db
      .delete(productsTable)
      .where(eq(productsTable.id, pdtId))
      .returning({ id: productsTable.id });

    if (pdt.length === 0) {
      return res.status(404).json({ error: "Product Not Found" });
    }

    return res.status(200).json({ message: "Product Deleted", id: pdt[0].id });
  } catch (e) {
    return res.status(500).json({ error: "Failed to delete this product" });
  }
};
