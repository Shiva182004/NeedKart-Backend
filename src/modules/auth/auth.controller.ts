import type { Request, Response } from "express";
import { authCookieOptions } from "../../config/cookie";
import * as authService from "./auth.service";
import type { LoginUserInput, SignupUserInput } from "./auth.types";

export const signup = async (req: Request, res: Response) => {
  const result = await authService.signup(req.body as SignupUserInput);

  res.cookie("token", result.token, authCookieOptions);

  return res.status(201).json({
    success: true,
    message: "Signup successful",
    user: result.user,
  });
};

export const login = async (req: Request, res: Response) => {
  const result = await authService.login(req.body as LoginUserInput);

  res.cookie("token", result.token, authCookieOptions);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    user: result.user,
  });
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token", authCookieOptions);
  return res.status(200).json({ success: true, message: "Logout successful" });
};
