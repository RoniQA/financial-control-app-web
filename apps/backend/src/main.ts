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

  // Disable ETag and caching for API responses to avoid 304 and stale data
  // This ensures lists reflect mutations immediately in production
  // Note: must be registered before controllers handle requests
  // Disable ETag globally in Express adapter
  (app as any).set('etag', false);
  
  // Debug middleware to log all requests
  app.use((req, res, next) => {
    console.log(`🔍 Request: ${req.method} ${req.path}`);
    next();
  });
  
  app.use('/api', (req, res, next) => {
    console.log(`🔍 API Request: ${req.method} ${req.path}`);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    res.removeHeader('ETag');
    next();
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

  // IMPORTANT: Register static files and catch-all routes AFTER all API routes
  // This ensures API routes are processed before static file serving
  const frontendPath = join(__dirname, '../frontend');
  if (require('fs').existsSync(frontendPath)) {
    console.log('✅ Frontend files found, registering static routes...');
    
    // Serve static files from frontend build
    app.useStaticAssets(frontendPath);
    console.log('✅ Serving static files from:', frontendPath);
    
    // Add catch-all route for SPA routing (ONLY for non-API routes)
    app.use('*', (req, res) => {
      console.log(`🔍 Catch-all route triggered for: ${req.method} ${req.path}`);
      // Only serve index.html for non-API routes
      if (req.path.startsWith('/api')) {
        // This should not happen as API routes should be handled above
        console.log(`❌ API route not found: ${req.path}`);
        res.status(404).json({ message: 'API endpoint not found', path: req.path });
        return;
      }
      // Serve index.html for all non-API routes (SPA)
      console.log(`📄 Serving index.html for: ${req.path}`);
      res.sendFile(join(frontendPath, 'index.html'));
    });
  } else {
    console.log('⚠️  Frontend files not found, running API-only mode');
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
  logger.log(`🏥 Health check: http://localhost:${port}/health`);
}

bootstrap();

