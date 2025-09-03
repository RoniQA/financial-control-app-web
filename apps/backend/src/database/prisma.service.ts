import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Try multiple ways to get DATABASE_URL
    let databaseUrl = process.env.DATABASE_URL;
    
    // If not found, try other common Railway environment variable names
    if (!databaseUrl) {
      databaseUrl = process.env.POSTGRES_URL || 
                   process.env.POSTGRES_DATABASE_URL || 
                   process.env.DATABASE_CONNECTION_STRING ||
                   process.env.DB_URL;
    }
    
    // Log all database-related environment variables
    console.log('🔍 Database environment variables:');
    Object.keys(process.env).forEach(key => {
      if (key.includes('DATABASE') || key.includes('POSTGRES') || key.includes('DB')) {
        const value = process.env[key];
        if (value && value.includes('://')) {
          const maskedValue = value.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@');
          console.log(`  - ${key}:`, maskedValue);
        } else {
          console.log(`  - ${key}:`, value ? '***' : 'undefined');
        }
      }
    });
    
    if (databaseUrl) {
      const maskedUrl = databaseUrl.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@');
      console.log('🔗 Using DATABASE_URL:', maskedUrl);
    } else {
      console.error('❌ No DATABASE_URL found in any environment variable');
      console.error('❌ Available environment variables:', Object.keys(process.env).filter(k => k.includes('DATABASE') || k.includes('POSTGRES') || k.includes('DB')));
    }

    super({
      log: ['query', 'info', 'warn', 'error'],
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }

  async onModuleInit() {
    try {
      console.log('🔄 Attempting to connect to database...');
      await this.$connect();
      console.log('✅ Prisma Client connected successfully');
    } catch (error) {
      console.error('❌ Failed to connect to database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') return;
    
    const models = Reflect.ownKeys(this).filter(key => key[0] !== '_');
    
    return Promise.all(models.map((modelKey) => {
      const model = this[modelKey as keyof this] as any;
      return model.deleteMany();
    }));
  }
}

