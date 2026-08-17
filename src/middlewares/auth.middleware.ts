import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/jwt";
import { prisma } from "../config/db";

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

export type UserRole = "ADMIN" | "PRODUCER" | "CONSUMER";
export type RequestUser = { id: string; role: UserRole };

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new Error("No Token Provided");
    }

    const decodeToken = verifyToken(token) as { id?: string };
    if (!decodeToken.id) throw new Error("Invalid token");

    const user = await prisma.user.findFirst({
      where: { id: decodeToken.id, deleted_at: null },
      select: { id: true, role: true },
    });
    if (!user) throw new Error("User not found");

    req.user = { id: user.id, role: user.role as UserRole };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};

export const requireRoles = (...roles: UserRole[]) => async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  next();
};

export const requireAdmin = requireRoles("ADMIN");
