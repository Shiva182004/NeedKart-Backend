import type { Request, Response } from "express";
import {
  changePasswordService,
  deleteUserById,
  getUserById,
  updateUserById,
} from "./user.service";

export const getLoggedInUserProfile = async (req: Request, res: Response) => {
  if (!req.user?.id) {
    throw new Error("User Not Authenticated");
  }
  const userId = req.user?.id;
  const user = await getUserById(userId);

  return res.status(200).json({
    success: true,
    user,
  });
};

export const getUser = async (req: Request, res: Response) => {
  if (!req.user?.id) {
    throw new Error("User Not Authenticated");
  }

  const userId = req.user?.id;
  const user = await getUserById(userId);

  return res.status(200).json({
    success: true,
    user,
  });
};

export const updateUser = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const updatedData = req.body;

  const user = await updateUserById(id, updatedData);
  return res.status(200).json({ success: true, user });
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  if (!id) throw new Error("User ID required");

  const user = await deleteUserById(id);

  return res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
};

export const changePassword = async (req: Request, res: Response) => {
  if (!req.user?.id) {
    throw new Error("User not authenticated");
  }

  const { oldPassword, newPassword } = req.body;

  await changePasswordService(req.user.id, oldPassword, newPassword);

  return res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
};
