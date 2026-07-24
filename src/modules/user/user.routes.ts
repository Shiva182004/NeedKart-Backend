import express from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { auth } from "../../middlewares/auth.middleware";
import {
  changePassword,
  deleteUser,
  getLoggedInUserProfile,
  getUser,
  updateUser,
} from "./user.controller";
import { validate } from "../../middlewares/validate.middleware";
import { changePasswordSchema, updateUserSchema } from "./user.types";

const router = express.Router();

// Get logged-in user's profile
router.get("/me", auth, asyncHandler(getLoggedInUserProfile));

// Get user by ID
router.get("/:id", auth, asyncHandler(getUser));

// Update user by ID
router.put("/:id", auth, validate(updateUserSchema), asyncHandler(updateUser));

// Delete user by ID
router.delete("/:id", auth, asyncHandler(deleteUser));

// Change password for logged-in user
router.patch(
  "/change-password",
  auth,
  validate(changePasswordSchema),
  asyncHandler(changePassword),
);

// Get all users (admin only)
router.get("/");

export default router;
