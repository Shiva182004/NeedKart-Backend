import express from "express";
import { login, logout, signup } from "./auth.controller";
import { signupUserSchema } from "./auth.types";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/asyncHandler";

const router = express.Router();

router.post("/signup", validate(signupUserSchema), asyncHandler(signup));
router.post("/login", asyncHandler(login));
router.post("/logout", asyncHandler(logout));

export default router;
