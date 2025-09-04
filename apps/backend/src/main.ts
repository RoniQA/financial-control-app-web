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
    origin: process.env.FRONTEND_URL || '*',
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

  // Serve static files from frontend build
  const frontendPath = join(__dirname, '..', '..', '..', 'apps', 'frontend', 'dist');
  console.log('📁 Frontend path:', frontendPath);
  
  // Check if frontend build exists
  const fs = require('fs');
  if (fs.existsSync(frontendPath)) {
    console.log('✅ Frontend build found, serving static files');
    app.useStaticAssets(frontendPath);
    
    // Serve frontend for all non-API routes (must be last)
    app.use('*', (req, res) => {
      // If it's an API route, let it pass through
      if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({
          message: 'API endpoint not found',
          error: 'Not Found',
          statusCode: 404
        });
      }
      
      // Serve index.html for all other routes (SPA routing)
      const indexPath = join(frontendPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).json({
          message: 'Frontend not found',
          error: 'Not Found',
          statusCode: 404
        });
      }
    });
  } else {
    console.log('❌ Frontend build not found at:', frontendPath);
    // Fallback for when frontend is not built
    app.use('*', (req, res) => {
      if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({
          message: 'API endpoint not found',
          error: 'Not Found',
          statusCode: 404
        });
      }
      
      res.status(200).json({
        message: 'Backend is running, but frontend is not built yet',
        status: 'backend-only',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      });
    });
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
  logger.log(`🏥 Health check: http://localhost:${port}/health`);
}

bootstrap();

