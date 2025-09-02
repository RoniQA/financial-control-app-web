"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Iniciando seed do banco de dados...');
    const company = await prisma.company.upsert({
        where: { cnpj: '12.345.678/0001-90' },
        update: {},
        create: {
            name: 'Nova Agro Ltda',
            cnpj: '12.345.678/0001-90',
            ie: '123456789',
            email: 'contato@novaagro.com',
            phone: '(11) 3333-4444',
            address: {
                street: 'Rua das Flores, 123',
                city: 'São Paulo',
                state: 'SP',
                zipCode: '01234-567',
            },
            fiscalConfig: {
                regime: 'SIMPLES_NACIONAL',
                csc: 'CSC123456',
                certificate: 'certificate-data',
            },
        },
    });
    console.log('✅ Empresa criada:', company.name);
    const adminRole = await prisma.role.create({
        data: {
            name: 'ADMIN',
            description: 'Administrador do sistema',
            permissions: ['*'],
        },
    });
    const financeRole = await prisma.role.create({
        data: {
            name: 'FINANCEIRO',
            description: 'Usuário financeiro',
            permissions: ['financial:read', 'financial:write', 'reports:read'],
        },
    });
    const salesRole = await prisma.role.create({
        data: {
            name: 'VENDAS',
            description: 'Usuário de vendas',
            permissions: ['sales:read', 'sales:write', 'products:read', 'partners:read'],
        },
    });
    const stockRole = await prisma.role.create({
        data: {
            name: 'ESTOQUISTA',
            description: 'Usuário de estoque',
            permissions: ['inventory:read', 'inventory:write', 'products:read'],
        },
    });
    console.log('✅ Roles criadas');
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await prisma.user.create({
        data: {
            email: 'admin@novaagro.com',
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'Sistema',
            phone: '(11) 99999-9999',
            companyId: company.id,
        },
    });
    await prisma.userRole.create({
        data: {
            userId: adminUser.id,
            roleId: adminRole.id,
        },
    });
    console.log('✅ Usuário admin criado:', adminUser.email);
    const warehouse1 = await prisma.warehouse.create({
        data: {
            name: 'Estoque Principal',
            code: 'EST-001',
            companyId: company.id,
            address: {
                street: 'Rua das Flores, 123',
                city: 'São Paulo',
                state: 'SP',
                zipCode: '01234-567',
            },
        },
    });
    const warehouse2 = await prisma.warehouse.create({
        data: {
            name: 'Oficina',
            code: 'OFI-001',
            companyId: company.id,
            address: {
                street: 'Rua das Flores, 123',
                city: 'São Paulo',
                state: 'SP',
                zipCode: '01234-567',
            },
        },
    });
    console.log('✅ Depósitos criados');
    const products = [
        {
            sku: 'BOMBA-001',
            name: 'Bomba Centrífuga 1/2 CV',
            description: 'Bomba centrífuga para água limpa',
            category: 'Bombas',
            brand: 'Schneider',
            model: 'Bomba-1/2CV-220V',
            variations: { voltage: '220V', power: '1/2 CV' },
            ncm: '8414.10.00',
            cest: '28.038.00',
            unit: 'UN',
            weight: 15.5,
            dimensions: { length: 30, width: 20, height: 25 },
            companyId: company.id,
        },
        {
            sku: 'TUBO-001',
            name: 'Tubo PVC 100mm',
            description: 'Tubo de PVC para esgoto',
            category: 'Tubos',
            brand: 'Tigre',
            model: 'PVC-100mm-6m',
            variations: { diameter: '100mm', length: '6m' },
            ncm: '3917.23.00',
            cest: '28.038.00',
            unit: 'UN',
            weight: 8.2,
            dimensions: { length: 600, width: 10, height: 10 },
            companyId: company.id,
        },
        {
            sku: 'VALV-001',
            name: 'Válvula de Retenção',
            description: 'Válvula de retenção para água',
            category: 'Válvulas',
            brand: 'Dancor',
            model: 'VR-50mm',
            variations: { diameter: '50mm' },
            ncm: '8481.30.00',
            cest: '28.038.00',
            unit: 'UN',
            weight: 2.1,
            dimensions: { length: 15, width: 15, height: 8 },
            companyId: company.id,
        },
        {
            sku: 'INV-001',
            name: 'Inversor de Frequência 1 CV',
            description: 'Inversor de frequência para motores',
            category: 'Inversores',
            brand: 'WEG',
            model: 'CFW08-1CV',
            variations: { power: '1 CV', voltage: '220V' },
            ncm: '8504.40.95',
            cest: '28.038.00',
            unit: 'UN',
            weight: 3.5,
            dimensions: { length: 25, width: 20, height: 15 },
            companyId: company.id,
        },
        {
            sku: 'CABO-001',
            name: 'Cabo Elétrico 2.5mm²',
            description: 'Cabo elétrico flexível',
            category: 'Cabos',
            brand: 'Prysmian',
            model: 'Cabo-2.5mm-100m',
            variations: { section: '2.5mm²', length: '100m' },
            ncm: '8544.42.90',
            cest: '28.038.00',
            unit: 'UN',
            weight: 12.8,
            dimensions: { length: 10000, width: 1, height: 1 },
            companyId: company.id,
        },
    ];
    for (const productData of products) {
        const product = await prisma.product.create({
            data: productData,
        });
        await prisma.productPrice.create({
            data: {
                productId: product.id,
                costPrice: Math.random() * 100 + 50,
                salePrice: Math.random() * 200 + 100,
                markup: Math.random() * 50 + 20,
            },
        });
        await prisma.stock.create({
            data: {
                productId: product.id,
                warehouseId: warehouse1.id,
                quantity: Math.floor(Math.random() * 50) + 10,
                minStock: 5,
                maxStock: 100,
                location: 'A-01',
            },
        });
        await prisma.stock.create({
            data: {
                productId: product.id,
                warehouseId: warehouse2.id,
                quantity: Math.floor(Math.random() * 20) + 5,
                minStock: 2,
                maxStock: 50,
                location: 'B-01',
            },
        });
    }
    console.log('✅ Produtos criados');
    const partners = [
        {
            type: 'CUSTOMER',
            name: 'João Silva',
            document: '123.456.789-00',
            email: 'joao@email.com',
            phone: '(11) 99999-9999',
            companyId: company.id,
        },
        {
            type: 'CUSTOMER',
            name: 'Maria Santos',
            document: '987.654.321-00',
            email: 'maria@email.com',
            phone: '(11) 88888-8888',
            companyId: company.id,
        },
        {
            type: 'SUPPLIER',
            name: 'Fornecedor ABC Ltda',
            document: '11.222.333/0001-44',
            ie: '123456789',
            email: 'vendas@fornecedorabc.com',
            phone: '(11) 77777-7777',
            companyId: company.id,
        },
        {
            type: 'SUPPLIER',
            name: 'Distribuidora XYZ',
            document: '55.666.777/0001-88',
            ie: '987654321',
            email: 'contato@distribuidoraxyz.com',
            phone: '(11) 66666-6666',
            companyId: company.id,
        },
    ];
    for (const partnerData of partners) {
        await prisma.partner.create({
            data: partnerData,
        });
    }
    console.log('✅ Parceiros criados');
    const fiscalConfigs = [
        {
            type: 'CSOSN',
            code: '101',
            name: 'Tributada pelo Simples Nacional com permissão de crédito',
            description: 'CSOSN 101 - Simples Nacional com crédito',
            config: { aliquota: 0, base: 0 },
            companyId: company.id,
        },
        {
            type: 'CSOSN',
            code: '102',
            name: 'Tributada pelo Simples Nacional sem permissão de crédito',
            description: 'CSOSN 102 - Simples Nacional sem crédito',
            config: { aliquota: 0, base: 0 },
            companyId: company.id,
        },
        {
            type: 'CFOP',
            code: '5102',
            name: 'Venda de mercadoria adquirida ou recebida de terceiros',
            description: 'CFOP 5102 - Venda de mercadoria',
            config: { tipo: 'venda' },
            companyId: company.id,
        },
        {
            type: 'CFOP',
            code: '1102',
            name: 'Compra para comercialização',
            description: 'CFOP 1102 - Compra para comercialização',
            config: { tipo: 'compra' },
            companyId: company.id,
        },
    ];
    for (const configData of fiscalConfigs) {
        await prisma.fiscalConfig.create({
            data: configData,
        });
    }
    console.log('✅ Configurações fiscais criadas');
    console.log('🎉 Seed concluído com sucesso!');
}
main()
    .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map