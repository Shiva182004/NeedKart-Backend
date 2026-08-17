import type { Request, Response } from "express";
import { z } from "zod";
import { ApiError } from "../../utils/api-error";
import {
  createServiceService,
  deleteServiceService,
  getServiceByIdService,
  getServiceService,
  getServicesByCategoryService,
  updateServiceService,
} from "./service.service";
import type { CreateServiceInput, UpdateServiceInput } from "./service.types";

const getId = (value: unknown, label: string) => {
  const result = z.string().uuid(`Invalid ${label} ID`).safeParse(value);
  if (!result.success) throw new ApiError(422, `Invalid ${label} ID`);
  return result.data;
};

const getActor = (req: Request) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  return req.user;
};

export const createService = async (req: Request, res: Response) => {
  const service = await createServiceService(
    getActor(req),
    req.body as CreateServiceInput,
  );
  return res.status(201).json({
    success: true,
    message: "Service created successfully",
    service,
  });
};

export const getServices = async (_req: Request, res: Response) => {
  const services = await getServiceService();
  return res.status(200).json({ success: true, services });
};

export const getServiceById = async (req: Request, res: Response) => {
  const service = await getServiceByIdService(getId(req.params.id, "service"));
  return res.status(200).json({ success: true, service });
};

export const getServicesByCategory = async (req: Request, res: Response) => {
  const services = await getServicesByCategoryService(
    getId(req.params.categoryId, "category"),
  );
  return res.status(200).json({ success: true, services });
};

export const updateService = async (req: Request, res: Response) => {
  const service = await updateServiceService(
    getActor(req),
    getId(req.params.id, "service"),
    req.body as UpdateServiceInput,
  );
  return res.status(200).json({
    success: true,
    message: "Service updated successfully",
    service,
  });
};

export const deleteService = async (req: Request, res: Response) => {
  await deleteServiceService(getActor(req), getId(req.params.id, "service"));
  return res.status(200).json({
    success: true,
    message: "Service deleted successfully",
  });
};
