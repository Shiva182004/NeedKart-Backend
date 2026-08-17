import type { RequestUser } from "../../middlewares/auth.middleware";
import { prisma } from "../../config/db";
import { ApiError } from "../../utils/api-error";
import type { CreateServiceInput, UpdateServiceInput } from "./service.types";

const serviceInclude = {
  category: { select: { id: true, name: true } },
  provider: { select: { id: true, name: true, profileImage: true } },
} as const;

const canManage = (actor: RequestUser, providerId: string) =>
  actor.role === "ADMIN" || actor.id === providerId;

const getActiveService = async (id: string) => {
  const service = await prisma.service.findFirst({
    where: { id, deleted_at: null },
    include: serviceInclude,
  });
  if (!service) throw new ApiError(404, "Service not found");
  return service;
};

export const createServiceService = async (
  actor: RequestUser,
  data: CreateServiceInput,
) => {
  const category = await prisma.category.findFirst({
    where: { id: data.categoryId, deleted_at: null },
    select: { id: true },
  });
  if (!category) throw new ApiError(404, "Category not found");

  return prisma.service.create({
    data: { ...data, providerId: actor.id },
    include: serviceInclude,
  });
};

export const getServiceService = () =>
  prisma.service.findMany({
    where: { deleted_at: null, category: { deleted_at: null } },
    orderBy: { created_at: "desc" },
    include: serviceInclude,
  });

export const getServiceByIdService = (id: string) => getActiveService(id);

export const getServicesByCategoryService = async (categoryId: string) => {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, deleted_at: null },
    select: { id: true },
  });
  if (!category) throw new ApiError(404, "Category not found");

  return prisma.service.findMany({
    where: { categoryId, deleted_at: null },
    orderBy: { created_at: "desc" },
    include: serviceInclude,
  });
};

export const updateServiceService = async (
  actor: RequestUser,
  id: string,
  data: UpdateServiceInput,
) => {
  const existing = await getActiveService(id);
  if (!canManage(actor, existing.provider.id)) {
    throw new ApiError(403, "You cannot modify this service");
  }

  if (data.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: data.categoryId, deleted_at: null },
      select: { id: true },
    });
    if (!category) throw new ApiError(404, "Category not found");
  }

  return prisma.service.update({
    where: { id },
    data,
    include: serviceInclude,
  });
};

export const deleteServiceService = async (actor: RequestUser, id: string) => {
  const existing = await getActiveService(id);
  if (!canManage(actor, existing.provider.id)) {
    throw new ApiError(403, "You cannot delete this service");
  }

  await prisma.service.update({
    where: { id },
    data: { deleted_at: new Date() },
  });
};
