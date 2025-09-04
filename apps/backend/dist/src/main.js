"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const common_2 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_2.Logger('Bootstrap');
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: process.env.FRONTEND_URL || '*',
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Nova Agro API')
        .setDescription('Sistema Web Nova Agro - Financeiro + Estoque + NF')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    app.use('/health', (req, res) => {
        res.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development'
        });
    });
    app.use('*', (req, res) => {
        if (req.originalUrl.startsWith('/api')) {
            return res.status(404).json({
                message: 'API endpoint not found',
                error: 'Not Found',
                statusCode: 404
            });
        }
        res.status(200).json({
            message: 'Gestus API is running successfully!',
            status: 'api-only',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            endpoints: {
                health: '/health',
                api: '/api',
                docs: '/api/docs'
            }
        });
    });
    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`🚀 Application is running on: http://localhost:${port}`);
    logger.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
    logger.log(`🏥 Health check: http://localhost:${port}/health`);
}
bootstrap();
//# sourceMappingURL=main.js.map