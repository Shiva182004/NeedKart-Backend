import { prisma } from "../../config/db";
import { comparePassword, hashPassword } from "../../lib/bcrypt";
import { generateToken } from "../../lib/jwt";
import { ApiError } from "../../utils/api-error";
import type { LoginUserInput, SignupUserInput } from "./auth.types";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  profileImage: true,
  role: true,
  isVerified: true,
  created_at: true,
} as const;

export const signup = async (data: SignupUserInput) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { name: { equals: data.name, mode: "insensitive" } },
        { email: { equals: data.email, mode: "insensitive" } },
        { phone: data.phone },
      ],
    },
  });

  if (existingUser) {
    if (existingUser.name.toLowerCase() === data.name.toLowerCase()) {
      throw new ApiError(409, "Name already exists");
    }

    if (existingUser.email.toLowerCase() === data.email.toLowerCase()) {
      throw new ApiError(409, "Email already exists");
    }

    if (existingUser.phone === data.phone) {
      throw new ApiError(409, "Phone already exists");
    }
  }

  const hashedPassword = await hashPassword(data.password);

  let user;
  try {
    user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
      },
      select: publicUserSelect,
    });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      throw new ApiError(409, "An account with these details already exists");
    }
    throw error;
  }

  const token = await generateToken({
    id: user.id,
  });

  return {
    user,
    token,
  };
};

export const login = async (data: LoginUserInput) => {
  const user = await prisma.user.findFirst({
    where: {
      email: { equals: data.email, mode: "insensitive" },
    },
  });

  if (!user || user.deleted_at) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await comparePassword(data.password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = await generateToken({
    id: user.id,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      role: user.role,
      isVerified: user.isVerified,
      created_at: user.created_at,
    },
    token,
  };
};
