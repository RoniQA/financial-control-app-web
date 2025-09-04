const { PrismaClient } = require('@prisma/client');

async function testDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test companies
    console.log('\n🔍 Testing companies...');
    const companies = await prisma.company.findMany();
    console.log(`📊 Found ${companies.length} companies:`);
    if (companies.length > 0) {
      companies.forEach(company => {
        console.log(`  - ID: ${company.id}, Name: ${company.name}`);
      });
    } else {
      console.log('  ❌ No companies found');
    }
    
    // Test users
    console.log('\n🔍 Testing users...');
    const users = await prisma.user.findMany();
    console.log(`📊 Found ${users.length} users:`);
    if (users.length > 0) {
      users.forEach(user => {
        console.log(`  - ID: ${user.id}, Email: ${user.email}, CompanyId: ${user.companyId}`);
      });
    } else {
      console.log('  ❌ No users found');
    }
    
    // Test products
    console.log('\n🔍 Testing products...');
    const products = await prisma.product.findMany();
    console.log(`📊 Found ${products.length} products:`);
    if (products.length > 0) {
      products.forEach(product => {
        console.log(`  - ID: ${product.id}, Name: ${product.name}, CompanyId: ${product.companyId}`);
      });
    } else {
      console.log('  ❌ No products found');
    }
    
    // Test products for specific company
    if (companies.length > 0) {
      const firstCompanyId = companies[0].id;
      console.log(`\n🔍 Testing products for company ${firstCompanyId}...`);
      const companyProducts = await prisma.product.findMany({
        where: { companyId: firstCompanyId }
      });
      console.log(`📊 Found ${companyProducts.length} products for this company`);
    }
    
    // Test warehouses
    console.log('\n🔍 Testing warehouses...');
    const warehouses = await prisma.warehouse.findMany();
    console.log(`📊 Found ${warehouses.length} warehouses:`);
    if (warehouses.length > 0) {
      warehouses.forEach(warehouse => {
        console.log(`  - ID: ${warehouse.id}, Name: ${warehouse.name}, CompanyId: ${warehouse.companyId}`);
      });
    } else {
      console.log('  ❌ No warehouses found');
    }
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
