import { prisma } from "../../config/db";
import { comparePassword, hashPassword } from "../../lib/bcrypt";
import type { UpdateUserType } from "./user.types";

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      profileImage: true,
      role: true,
    },
  });

  if (!user) {
    throw new Error("User Not Found");
  }

  return user;
};

export const updateUserById = async (
  userId: string,
  updatedData: UpdateUserType,
) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name: updatedData.name,
      email: updatedData.email,
      phone: updatedData.phone,
      profileImage: updatedData.profileImage,
    },
  });

  return user;
};

export const deleteUserById = async (userId: string) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      deleted_at: new Date(),
    },
    select: {
      id: true,
      name: true,
      email: true,
      deleted_at: true,
    },
  });
};

export const changePasswordService = async (
  userId: string,
  oldPassword: string,
  newPassword: string,
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User Not Fount");
  }

  const isPasswordCorrect = await comparePassword(oldPassword, user.password);
  if (!isPasswordCorrect) {
    throw new Error("Old Password is Incorrect");
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: newPassword },
  });
};
