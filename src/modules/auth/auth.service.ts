import { prisma } from "../../config/db";
import { loginUserSchema, signupUserSchema } from "./auth.types";
import { comparePassword, hashPassword } from "../../lib/bcrypt";
import { generateToken } from "../../lib/jwt";

export const signup = async (body: unknown) => {
  const { success, data } = signupUserSchema.safeParse(body);

  if (!success) {
    throw new Error("Invalid Data");
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ name: data.name }, { email: data.email }, { phone: data.phone }],
    },
  });

  if (existingUser) {
    if (existingUser.name === data.name) {
      throw new Error("Name already exists");
    }

    if (existingUser.email === data.email) {
      throw new Error("Email already exists");
    }

    if (existingUser.phone === data.phone) {
      throw new Error("Phone already exists");
    }
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
    },
  });

  const token = await generateToken({
    id: user.id,
  });

  return {
    user,
    token,
  };
};

export const login = async (body: unknown) => {
  const { success, data } = loginUserSchema.safeParse(body);

  if (!success) {
    throw new Error("Invalid Data");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await comparePassword(data.password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = await generateToken({
    id: user.id,
  });

  return {
    user,
    token,
  };
};
