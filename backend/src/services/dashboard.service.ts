import prisma from '../config/prisma';

export class DashboardService {
  async getDashboardData(tenantId: string) {
    // Get all KPI data in parallel
    const [vehicleStats, salesStats, customerStats, warrantyStats] = await Promise.all([
      this.getVehicleStats(tenantId),
      this.getSalesStats(tenantId),
      this.getCustomerStats(tenantId),
      this.getWarrantyStats(tenantId),
    ]);

    return {
      kpis: {
        vehicles: vehicleStats,
        sales: salesStats,
        customers: customerStats,
        warranty: warrantyStats,
      },
      recentActivities: await this.getRecentActivities(tenantId),
      alerts: await this.getAlerts(tenantId),
    };
  }

  private async getVehicleStats(tenantId: string) {
    const total = await prisma.vehicle.count({ where: { tenantId } });
    const available = await prisma.vehicle.count({
      where: { tenantId, status: 'available' },
    });
    const reserved = await prisma.vehicle.count({
      where: { tenantId, status: 'reserved' },
    });
    const sold = await prisma.vehicle.count({
      where: { tenantId, status: 'sold' },
    });
    const claimed = await prisma.vehicle.count({
      where: { tenantId, status: 'claimed' },
    });

    return {
      total,
      available,
      reserved,
      sold,
      claimed,
    };
  }

  private async getSalesStats(tenantId: string) {
    // This month sales
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const monthEnd = new Date();
    monthEnd.setHours(23, 59, 59, 999);

    const thisMonthResult = await prisma.salesInvoice.aggregate({
      where: {
        tenantId,
        saleDate: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
      _sum: { totalAmount: true },
      _count: true,
    });

    // Last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const last30DaysResult = await prisma.salesInvoice.aggregate({
      where: {
        tenantId,
        saleDate: {
          gte: thirtyDaysAgo,
        },
      },
      _sum: { totalAmount: true },
    });

    return {
      thisMonth: thisMonthResult._sum.totalAmount || 0,
      thisMonthCount: thisMonthResult._count,
      last30Days: last30DaysResult._sum.totalAmount || 0,
    };
  }

  private async getCustomerStats(tenantId: string) {
    const total = await prisma.customer.count({ where: { tenantId } });

    const outstandingBalance = await prisma.customer.aggregate({
      where: { tenantId },
      _sum: { outstandingBalance: true },
    });

    return {
      total,
      outstandingBalance: outstandingBalance._sum.outstandingBalance || 0,
    };
  }

  private async getWarrantyStats(tenantId: string) {
    const pending = await prisma.warrantyClaim.count({
      where: { tenantId, status: 'pending' },
    });

    const underReview = await prisma.warrantyClaim.count({
      where: { tenantId, status: 'under_review' },
    });

    const total = await prisma.warrantyClaim.count({
      where: { tenantId },
    });

    return {
      total,
      pending,
      underReview,
      needsAttention: pending + underReview,
    };
  }

  private async getRecentActivities(tenantId: string) {
    const recentSales = await prisma.salesInvoice.findMany({
      where: { tenantId },
      include: {
        customer: true,
        vehicle: { include: { model: true } },
      },
      orderBy: { saleDate: 'desc' },
      take: 5,
    });

    const recentClaims = await prisma.warrantyClaim.findMany({
      where: { tenantId },
      include: { customer: true },
      orderBy: { filedDate: 'desc' },
      take: 5,
    });

    return [
      ...recentSales.map((sale) => ({
        id: sale.id,
        type: 'sale',
        title: `Sale: ${sale.vehicle?.model.name} to ${sale.customer.name}`,
        amount: sale.totalAmount,
        date: sale.saleDate,
        icon: '💰',
      })),
      ...recentClaims.map((claim) => ({
        id: claim.id,
        type: 'claim',
        title: `Warranty Claim from ${claim.customer.name}`,
        status: claim.status,
        date: claim.filedDate,
        icon: '⚠️',
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  private async getAlerts(tenantId: string) {
    const alerts = [];

    // Low stock parts
    const lowStockParts = await prisma.sparePartInventory.findMany({
      where: {
        part: { tenantId },
      },
      include: {
        part: true,
      },
    });

    lowStockParts.forEach((inventory) => {
      if (inventory.quantityAvailable <= inventory.part.reorderLevel) {
        alerts.push({
          type: 'low_stock',
          severity: 'warning',
          message: `Low stock: ${inventory.part.name} (${inventory.quantityAvailable} units)`,
          icon: '📦',
        });
      }
    });

    // Pending warranty claims
    const pendingClaims = await prisma.warrantyClaim.count({
      where: { tenantId, status: 'pending' },
    });

    if (pendingClaims > 0) {
      alerts.push({
        type: 'pending_claims',
        severity: 'info',
        message: `${pendingClaims} pending warranty claims need review`,
        icon: '📋',
      });
    }

    // Overdue payments
    const overdueInvoices = await prisma.salesInvoice.count({
      where: {
        tenantId,
        paymentStatus: 'pending',
        saleDate: {
          lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        },
      },
    });

    if (overdueInvoices > 0) {
      alerts.push({
        type: 'overdue_payment',
        severity: 'warning',
        message: `${overdueInvoices} overdue payments (30+ days)`,
        icon: '⏰',
      });
    }

    return alerts.slice(0, 5); // Return top 5 alerts
  }
}

export default new DashboardService();
