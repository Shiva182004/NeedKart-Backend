import { prisma } from "../../config/db";
import { ApiError } from "../../utils/api-error";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./category.types";

export const createCategoryService = async (
  categoryData: CreateCategoryInput,
) => {
  const existingCategory = await prisma.category.findFirst({
    where: {
      name: { equals: categoryData.name, mode: "insensitive" },
      deleted_at: null,
    },
  });

  if (existingCategory) {
    throw new ApiError(409, "A category with this name already exists");
  }

  try {
    const category = await prisma.category.create({
      data: categoryData,
    });

    return category;
  } catch (error: unknown) {
    // The initial lookup gives a helpful error; the database constraint closes
    // the race window when two requests create the same category concurrently.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      throw new ApiError(409, "A category with this name already exists");
    }

    throw error;
  }
};

export const getCategoryService = async () => {
  return prisma.category.findMany({
    where: { deleted_at: null },
    orderBy: { created_at: "desc" },
  });
};

export const getCategoryByIdService = async (id: string) => {
  const category = await prisma.category.findFirst({
    where: { id, deleted_at: null },
  });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
};

export const updateCategoryService = async (
  id: string,
  categoryData: UpdateCategoryInput,
) => {
  await getCategoryByIdService(id);

  if (categoryData.name) {
    const existingCategory = await prisma.category.findFirst({
      where: {
        id: { not: id },
        name: { equals: categoryData.name, mode: "insensitive" },
        deleted_at: null,
      },
    });

    if (existingCategory) {
      throw new ApiError(409, "A category with this name already exists");
    }
  }

  try {
    return await prisma.category.update({
      where: { id },
      data: categoryData,
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      throw new ApiError(409, "A category with this name already exists");
    }

    throw error;
  }
};

export const deleteCategoryService = async (id: string) => {
  await getCategoryByIdService(id);

  return prisma.category.update({
    where: { id },
    data: { deleted_at: new Date() },
  });
};
