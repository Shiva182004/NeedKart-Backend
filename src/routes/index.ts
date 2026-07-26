import express from "express";
import authRoutes from "../modules/auth/auth.routes";
import userRouter from "../modules/user/user.routes";
import categoryRouter from "../modules/category/category.routes";
import serviceRouter from "../modules/service/service.routes";

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/user", userRouter);

router.use("/categories", categoryRouter);

router.use("/services", serviceRouter);

export default router;
