import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/jwt";
import { prisma } from "../config/db";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new Error("No Token Provided");
    }

    const decodeToken = verifyToken(token) as { id: string };

    req.user = { id: decodeToken.id };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user?.id) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const user = await prisma.user.findFirst({
    where: { id: req.user.id, deleted_at: null },
    select: { role: true },
  });

  if (user?.role !== "ADMIN") {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  next();
};
