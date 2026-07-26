import express from "express";
import { auth, requireAdmin } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  createCategory,
  deleteCategory,
  getCategory,
  getCategoryById,
  updateCategory,
} from "./category.controller";
import { createCategorySchema, updateCategorySchema } from "./category.types";

const router = express.Router();

router.post(
  "/",
  auth,
  asyncHandler(requireAdmin),
  validate(createCategorySchema),
  asyncHandler(createCategory),
);

// get all categories
router.get("/", auth, asyncHandler(getCategory));

// get one category
router.get("/:id", auth, asyncHandler(getCategoryById));

// update category
router.patch(
  "/:id",
  auth,
  asyncHandler(requireAdmin),
  validate(updateCategorySchema),
  asyncHandler(updateCategory),
);

// soft delete category
router.delete(
  "/:id",
  auth,
  asyncHandler(requireAdmin),
  asyncHandler(deleteCategory),
);

export default router;
