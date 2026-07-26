import { prisma } from "../../config/db";
import { comparePassword, hashPassword } from "../../lib/bcrypt";
import { ApiError } from "../../utils/api-error";
import type { UpdateUserType } from "./user.types";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  profileImage: true,
  role: true,
  isVerified: true,
  created_at: true,
  updated_at: true,
} as const;

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, deleted_at: null },
    select: publicUserSelect,
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

export const updateUserById = async (
  userId: string,
  updatedData: UpdateUserType,
) => {
  await getUserById(userId);

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: updatedData,
      select: publicUserSelect,
    });

    return user;
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      throw new ApiError(409, "Name, email, or phone is already in use");
    }
    throw error;
  }
};

export const deleteUserById = async (userId: string) => {
  await getUserById(userId);

  return prisma.user.update({
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
  const user = await prisma.user.findFirst({
    where: { id: userId, deleted_at: null },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await comparePassword(oldPassword, user.password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Current password is incorrect");
  }

  if (oldPassword === newPassword) {
    throw new ApiError(422, "New password must be different");
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
};
