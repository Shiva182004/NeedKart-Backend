import express from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { auth } from "../../middlewares/auth.middleware";
import {
  changePassword,
  deleteUser,
  getLoggedInUserProfile,
  updateUser,
} from "./user.controller";
import { validate } from "../../middlewares/validate.middleware";
import { changePasswordSchema, updateUserSchema } from "./user.types";

const router = express.Router();

// Get logged-in user's profile
router.get("/me", auth, asyncHandler(getLoggedInUserProfile));

// Update the logged-in user's profile
router.patch("/me", auth, validate(updateUserSchema), asyncHandler(updateUser));

// Soft-delete the logged-in user's account
router.delete("/me", auth, asyncHandler(deleteUser));

// Change password for logged-in user
router.patch(
  "/change-password",
  auth,
  validate(changePasswordSchema),
  asyncHandler(changePassword),
);

export default router;
