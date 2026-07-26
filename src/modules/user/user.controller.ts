import type { Request, Response } from "express";
import {
  changePasswordService,
  deleteUserById,
  getUserById,
  updateUserById,
} from "./user.service";
import type { ChangePasswordType, UpdateUserType } from "./user.types";

export const getLoggedInUserProfile = async (req: Request, res: Response) => {
  if (!req.user?.id) {
    throw new Error("User not authenticated");
  }
  const userId = req.user?.id;
  const user = await getUserById(userId);

  return res.status(200).json({
    success: true,
    user,
  });
};

export const updateUser = async (req: Request, res: Response) => {
  if (!req.user?.id) throw new Error("User not authenticated");

  const user = await updateUserById(req.user.id, req.body as UpdateUserType);
  return res.status(200).json({ success: true, user });
};

export const deleteUser = async (req: Request, res: Response) => {
  if (!req.user?.id) throw new Error("User not authenticated");

  await deleteUserById(req.user.id);

  return res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
};

export const changePassword = async (req: Request, res: Response) => {
  if (!req.user?.id) {
    throw new Error("User not authenticated");
  }

  const { oldPassword, newPassword } = req.body as ChangePasswordType;

  await changePasswordService(req.user.id, oldPassword, newPassword);

  return res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
};
