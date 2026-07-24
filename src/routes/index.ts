import express from "express";
import authRoutes from "../modules/auth/auth.routes";

const router = express.Router();

router.use("/auth", authRoutes);

// router.use("/user", userRouter);

// router.use('/problems', problemRoutes);

export default router;
