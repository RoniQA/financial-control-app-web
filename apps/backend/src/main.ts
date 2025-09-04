import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Bootstrap');

  // Global prefix
  app.setGlobalPrefix('api');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS configuration
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://financial-control-app-web-production.up.railway.app', 'https://*.up.railway.app']
      : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Nova Agro API')
    .setDescription('Sistema Web Nova Agro - Financeiro + Estoque + NF')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Simple health check endpoint (must be before static files)
  app.use('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Serve static files from frontend build (only if files exist)
  const frontendPath = join(__dirname, '../frontend');
  if (require('fs').existsSync(frontendPath)) {
    app.useStaticAssets(frontendPath);
    console.log('✅ Serving static files from:', frontendPath);
  } else {
    console.log('⚠️  Frontend files not found, running API-only mode');
  }

  // Add catch-all route for SPA routing (AFTER all API routes are registered)
  if (require('fs').existsSync(frontendPath)) {
    app.use('*', (req, res) => {
      // Serve index.html for all non-API routes (SPA)
      res.sendFile(join(frontendPath, 'index.html'));
    });
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
  logger.log(`🏥 Health check: http://localhost:${port}/health`);
}

bootstrap();

