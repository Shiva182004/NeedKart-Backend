import express from "express";
import { auth, requireRoles } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  createService,
  deleteService,
  getServiceById,
  getServices,
  getServicesByCategory,
  updateService,
} from "./service.controller";
import { createServiceSchema, updateServiceSchema } from "./service.types";

const router = express.Router();

// Keep this route before /:id so "category" is not treated as an ID.
router.get("/category/:categoryId", auth, asyncHandler(getServicesByCategory));
router.get("/", auth, asyncHandler(getServices));
router.get("/:id", auth, asyncHandler(getServiceById));

router.post(
  "/",
  auth,
  requireRoles("ADMIN", "PRODUCER"),
  validate(createServiceSchema),
  asyncHandler(createService),
);
router.patch(
  "/:id",
  auth,
  requireRoles("ADMIN", "PRODUCER"),
  validate(updateServiceSchema),
  asyncHandler(updateService),
);
router.delete(
  "/:id",
  auth,
  requireRoles("ADMIN", "PRODUCER"),
  asyncHandler(deleteService),
);

export default router;
