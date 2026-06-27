import prisma from '../config/prisma';

export class VehicleModelService {
  async getModels(tenantId: string) {
    return prisma.vehicleModel.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
    });
  }

  async getModel(modelId: string, tenantId: string) {
    const model = await prisma.vehicleModel.findFirst({
      where: { id: modelId, tenantId },
    });

    if (!model) {
      throw new Error('Vehicle model not found');
    }

    return model;
  }

  async createModel(
    tenantId: string,
    data: {
      name: string;
      basePrice: number;
      specifications?: Record<string, any>;
    }
  ) {
    return prisma.vehicleModel.create({
      data: {
        tenantId,
        name: data.name,
        basePrice: data.basePrice,
        specifications: data.specifications,
      },
    });
  }

  async updateModel(
    modelId: string,
    tenantId: string,
    data: {
      name?: string;
      basePrice?: number;
      specifications?: Record<string, any>;
    }
  ) {
    const model = await prisma.vehicleModel.findFirst({
      where: { id: modelId, tenantId },
    });

    if (!model) {
      throw new Error('Vehicle model not found');
    }

    return prisma.vehicleModel.update({
      where: { id: modelId },
      data,
    });
  }

  async deleteModel(modelId: string, tenantId: string) {
    const model = await prisma.vehicleModel.findFirst({
      where: { id: modelId, tenantId },
    });

    if (!model) {
      throw new Error('Vehicle model not found');
    }

    // Check if any vehicles use this model
    const vehicleCount = await prisma.vehicle.count({
      where: { modelId },
    });

    if (vehicleCount > 0) {
      throw new Error('Cannot delete model with existing vehicles');
    }

    await prisma.vehicleModel.delete({
      where: { id: modelId },
    });

    return { message: 'Vehicle model deleted successfully' };
  }
}

export default new VehicleModelService();
