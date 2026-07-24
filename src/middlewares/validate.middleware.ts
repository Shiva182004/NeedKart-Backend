import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/jwt";

export const validate = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Validation Failed",
      });
    }

    req.body = result.data;

    next();
  };
};

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(404);
  }

  const payload = verifyToken(token);

  // req.user = payload;

  next();
};
