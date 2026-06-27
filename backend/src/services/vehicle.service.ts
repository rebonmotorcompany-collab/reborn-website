import prisma from '../config/prisma';

export class VehicleService {
  // Get all vehicles for a tenant
  async getVehicles(
    tenantId: string,
    filters?: {
      status?: string;
      modelId?: string;
      page?: number;
      limit?: number;
    }
  ) {
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };
    if (filters?.status) where.status = filters.status;
    if (filters?.modelId) where.modelId = filters.modelId;

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        include: {
          model: true,
          battery: true,
          salesInvoice: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.vehicle.count({ where }),
    ]);

    return {
      data: vehicles,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Get single vehicle
  async getVehicle(vehicleId: string, tenantId: string) {
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: vehicleId, tenantId },
      include: {
        model: true,
        battery: { include: { batteryHistory: true } },
        salesInvoice: { include: { payments: true } },
      },
    });

    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    return vehicle;
  }

  // Create vehicle
  async createVehicle(
    tenantId: string,
    data: {
      modelId: string;
      chassisNumber: string;
      motorNumber: string;
      purchasePrice: number;
    }
  ) {
    // Check for duplicate chassis number
    const existingVehicle = await prisma.vehicle.findFirst({
      where: { chassisNumber: data.chassisNumber },
    });

    if (existingVehicle) {
      throw new Error('Vehicle with this chassis number already exists');
    }

    // Verify model exists
    const model = await prisma.vehicleModel.findFirst({
      where: { id: data.modelId, tenantId },
    });

    if (!model) {
      throw new Error('Vehicle model not found');
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        tenantId,
        modelId: data.modelId,
        chassisNumber: data.chassisNumber,
        motorNumber: data.motorNumber,
        purchasePrice: data.purchasePrice,
        sellingPrice: model.basePrice,
        status: 'available',
      },
      include: {
        model: true,
      },
    });

    return vehicle;
  }

  // Update vehicle
  async updateVehicle(
    vehicleId: string,
    tenantId: string,
    data: {
      sellingPrice?: number;
      status?: string;
    }
  ) {
    // Verify vehicle exists
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: vehicleId, tenantId },
    });

    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    // Validate status transitions
    const validStatuses = ['available', 'reserved', 'sold', 'claimed'];
    if (data.status && !validStatuses.includes(data.status)) {
      throw new Error('Invalid vehicle status');
    }

    const updated = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        ...(data.sellingPrice && { sellingPrice: data.sellingPrice }),
        ...(data.status && { status: data.status }),
      },
      include: {
        model: true,
        battery: true,
      },
    });

    return updated;
  }

  // Delete vehicle
  async deleteVehicle(vehicleId: string, tenantId: string) {
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: vehicleId, tenantId },
    });

    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    // Check if vehicle is sold
    if (vehicle.status === 'sold') {
      throw new Error('Cannot delete sold vehicle');
    }

    await prisma.vehicle.delete({
      where: { id: vehicleId },
    });

    return { message: 'Vehicle deleted successfully' };
  }

  // Search vehicles
  async searchVehicles(tenantId: string, query: string) {
    return prisma.vehicle.findMany({
      where: {
        tenantId,
        OR: [
          { chassisNumber: { contains: query, mode: 'insensitive' } },
          { motorNumber: { contains: query, mode: 'insensitive' } },
          { model: { name: { contains: query, mode: 'insensitive' } } },
        ],
      },
      include: {
        model: true,
        battery: true,
      },
      take: 20,
    });
  }

  // Get vehicles by status
  async getVehiclesByStatus(tenantId: string, status: string) {
    return prisma.vehicle.count({
      where: { tenantId, status },
    });
  }

  // Get dashboard stats
  async getDashboardStats(tenantId: string) {
    const [
      totalVehicles,
      availableVehicles,
      reservedVehicles,
      soldVehicles,
      claimedVehicles,
    ] = await Promise.all([
      prisma.vehicle.count({ where: { tenantId } }),
      prisma.vehicle.count({ where: { tenantId, status: 'available' } }),
      prisma.vehicle.count({ where: { tenantId, status: 'reserved' } }),
      prisma.vehicle.count({ where: { tenantId, status: 'sold' } }),
      prisma.vehicle.count({ where: { tenantId, status: 'claimed' } }),
    ]);

    // Calculate this month sales
    const monthStart = new Date();
    monthStart.setDate(1);
    const monthEnd = new Date();

    const monthlySales = await prisma.salesInvoice.aggregate({
      where: {
        tenantId,
        saleDate: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      _sum: {
        totalAmount: true,
      },
    });

    // Get low stock parts
    const lowStockParts = await prisma.sparePartInventory.findMany({
      where: {
        part: { tenantId },
        quantityAvailable: {
          lte: prisma.sparePart.fields.reorderLevel as any, // Compare with reorder level
        },
      },
      include: {
        part: true,
      },
      take: 5,
    });

    // Get pending claims
    const pendingClaims = await prisma.warrantyClaim.count({
      where: {
        tenantId,
        status: { in: ['pending', 'under_review'] },
      },
    });

    return {
      inventory: {
        total: totalVehicles,
        available: availableVehicles,
        reserved: reservedVehicles,
        sold: soldVehicles,
        claimed: claimedVehicles,
      },
      sales: {
        thisMonth: monthlySales._sum.totalAmount || 0,
      },
      alerts: {
        lowStock: lowStockParts.length,
        pendingClaims,
      },
    };
  }

  // Get recent transactions
  async getRecentTransactions(tenantId: string, limit = 10) {
    const salesInvoices = await prisma.salesInvoice.findMany({
      where: { tenantId },
      include: {
        customer: true,
        vehicle: { include: { model: true } },
      },
      orderBy: { saleDate: 'desc' },
      take: limit,
    });

    return salesInvoices.map((invoice) => ({
      id: invoice.id,
      type: 'sale',
      description: `Sold ${invoice.vehicle?.model.name} to ${invoice.customer.name}`,
      amount: invoice.totalAmount,
      date: invoice.saleDate,
      reference: invoice.invoiceNumber,
    }));
  }
}

export default new VehicleService();
