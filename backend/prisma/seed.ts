import prisma from '../src/config/prisma';

async function seed() {
  try {
    console.log('🌱 Starting database seed...\n');

    // Get or create test tenant
    let tenant = await prisma.tenant.findFirst({
      where: { companyName: 'Demo EV Showroom' },
    });

    if (!tenant) {
      tenant = await prisma.tenant.create({
        data: {
          companyName: 'Demo EV Showroom',
          subscriptionTier: 'pro',
          status: 'active',
        },
      });
      console.log('✓ Created demo tenant:', tenant.companyName);
    } else {
      console.log('✓ Using existing demo tenant:', tenant.companyName);
    }

    // Create vehicle models
    const models = await prisma.vehicleModel.findMany({
      where: { tenantId: tenant.id },
    });

    if (models.length === 0) {
      const modelData = [
        {
          name: 'Tesla Model 3',
          basePrice: 2000000,
          specifications: { range: '500km', battery: '82kWh', type: 'graphene' },
        },
        {
          name: 'Tesla Model Y',
          basePrice: 2500000,
          specifications: { range: '600km', battery: '100kWh', type: 'graphene' },
        },
        {
          name: 'MG ZS EV',
          basePrice: 1500000,
          specifications: { range: '450km', battery: '62kWh', type: 'lithium' },
        },
        {
          name: 'Hyundai Kona',
          basePrice: 1800000,
          specifications: { range: '500km', battery: '72kWh', type: 'lithium' },
        },
      ];

      for (const model of modelData) {
        await prisma.vehicleModel.create({
          data: {
            ...model,
            tenantId: tenant.id,
          },
        });
      }

      console.log('✓ Created', modelData.length, 'vehicle models');
    } else {
      console.log('✓ Vehicle models already exist:', models.length);
    }

    // Create sample vehicles
    const vehicleCount = await prisma.vehicle.count({
      where: { tenantId: tenant.id },
    });

    if (vehicleCount === 0) {
      const vehicleModels = await prisma.vehicleModel.findMany({
        where: { tenantId: tenant.id },
      });

      const statuses = ['available', 'reserved', 'sold', 'claimed'];
      let vehicleIdx = 0;

      for (let i = 0; i < 20; i++) {
        const model = vehicleModels[i % vehicleModels.length];
        const status = statuses[Math.floor(i / 5) % statuses.length];

        await prisma.vehicle.create({
          data: {
            tenantId: tenant.id,
            modelId: model.id,
            chassisNumber: `CHASSIS-${String(i + 1).padStart(5, '0')}`,
            motorNumber: `MOTOR-${String(i + 1).padStart(5, '0')}`,
            purchasePrice: model.basePrice * 0.9,
            sellingPrice: model.basePrice,
            status: status as any,
          },
        });

        vehicleIdx++;
      }

      console.log('✓ Created 20 sample vehicles');
    } else {
      console.log('✓ Vehicles already exist:', vehicleCount);
    }

    // Create sample customers
    const customerCount = await prisma.customer.count({
      where: { tenantId: tenant.id },
    });

    if (customerCount === 0) {
      const customers = [
        {
          name: 'Rajesh Kumar',
          cnic: 'CNIC001',
          email: 'rajesh@example.com',
          phone: '9876543210',
          address: 'Mumbai, India',
        },
        {
          name: 'Priya Singh',
          cnic: 'CNIC002',
          email: 'priya@example.com',
          phone: '9876543211',
          address: 'Delhi, India',
        },
        {
          name: 'Arjun Patel',
          cnic: 'CNIC003',
          email: 'arjun@example.com',
          phone: '9876543212',
          address: 'Bangalore, India',
        },
      ];

      for (const customer of customers) {
        await prisma.customer.create({
          data: {
            ...customer,
            tenantId: tenant.id,
          },
        });
      }

      console.log('✓ Created', customers.length, 'sample customers');
    } else {
      console.log('✓ Customers already exist:', customerCount);
    }

    // Create sample sales invoices
    const invoiceCount = await prisma.salesInvoice.count({
      where: { tenantId: tenant.id },
    });

    if (invoiceCount === 0) {
      const customers = await prisma.customer.findMany({
        where: { tenantId: tenant.id },
      });

      const soldVehicles = await prisma.vehicle.findMany({
        where: { tenantId: tenant.id, status: 'sold' },
      });

      for (let i = 0; i < Math.min(customers.length, soldVehicles.length); i++) {
        await prisma.salesInvoice.create({
          data: {
            tenantId: tenant.id,
            invoiceNumber: `INV-${String(i + 1).padStart(5, '0')}`,
            customerId: customers[i].id,
            vehicleId: soldVehicles[i].id,
            saleDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            totalAmount: 2000000 + Math.random() * 1000000,
            discountAmount: Math.random() * 100000,
            paymentStatus: Math.random() > 0.3 ? 'paid' : 'pending',
          },
        });
      }

      console.log('✓ Created sample sales invoices');
    } else {
      console.log('✓ Sales invoices already exist:', invoiceCount);
    }

    console.log('\n✅ Database seeding completed successfully!\n');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
