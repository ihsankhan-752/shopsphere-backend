import { eq } from "drizzle-orm";
import db from "../db/index.js";
import { categoriesTable } from "../db/schema/categories.schema.js";

import { categoryValidation } from "../validations/category.validation.js";
import { z } from "zod";

export const addNewCategory = async (req, res) => {
  const categoryValidationResult = await categoryValidation.safeParseAsync(
    req.body,
  );
  if (!categoryValidationResult.success) {
    const error = z.treeifyError(categoryValidationResult.error);
    return res.status(400).json({ error: error });
  }
  const { title } = categoryValidationResult.data;

  const [result] = await db
    .insert(categoriesTable)
    .values({ title })
    .returning({ id: categoriesTable.id });

  return res.status(201).json({ message: "Category Created", id: result.id });
};

export const getAllCategories = async (req, res) => {
  const categories = await db
    .select({ id: categoriesTable.id, title: categoriesTable.title })
    .from(categoriesTable);

  if (categories.length === 0) {
    return res.status(404).json({ error: "No Categories Found" });
  }

  return res.status(200).json({ categories });
};

export const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;

  try {
    const category = await db
      .delete(categoriesTable)
      .where(eq(categoriesTable.id, categoryId))
      .returning({ id: categoriesTable.id });

    if (category.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json({ message: "Category Deleted Successfully" });
  } catch (error) {
    return res.status(409).json({ message: "Category Can not be deleted" });
  }
};

export const updateCategory = async (req, res) => {
  const id = req.params.id;

  const { title } = req.body;

  try {
    const result = await db
      .update(categoriesTable)
      .set({ title })
      .where(eq(categoriesTable.id, id))
      .returning({ id: categoriesTable.id, title: categoriesTable.title });

    if (result.length === 0) {
      return res.status(404).json({ error: "No Category Found" });
    }

    return res.status(200).json({ message: "Category Updated" });
  } catch (err) {
    return res.status(409).json({ error: "Failed to update category" });
  }
};
