import type { Request, Response } from "express";
import { z } from "zod";
import {
  createCategoryService,
  deleteCategoryService,
  getCategoryByIdService,
  getCategoryService,
  updateCategoryService,
} from "./category.service";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./category.types";
import { ApiError } from "../../utils/api-error";

const getCategoryId = (req: Request) => {
  const result = z
    .string()
    .uuid("Invalid category ID")
    .safeParse(req.params.id);
  if (!result.success) throw new ApiError(422, "Invalid category ID");
  return result.data;
};

export const createCategory = async (req: Request, res: Response) => {
  const categoryData = req.body as CreateCategoryInput;
  const category = await createCategoryService(categoryData);
  return res.status(201).json({
    success: true,
    message: "Category created successfully",
    category,
  });
};

export const getCategory = async (req: Request, res: Response) => {
  const categories = await getCategoryService();
  return res.status(200).json({
    success: true,
    categories,
  });
};

export const getCategoryById = async (req: Request, res: Response) => {
  const id = getCategoryId(req);
  const category = await getCategoryByIdService(id);
  return res.status(200).json({
    success: true,
    category,
  });
};

export const updateCategory = async (req: Request, res: Response) => {
  const id = getCategoryId(req);
  const category = await updateCategoryService(
    id,
    req.body as UpdateCategoryInput,
  );

  return res.status(200).json({
    success: true,
    message: "Category updated successfully",
    category,
  });
};

export const deleteCategory = async (req: Request, res: Response) => {
  const id = getCategoryId(req);
  await deleteCategoryService(id);

  return res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
};
