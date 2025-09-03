import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // Log da DATABASE_URL para debug (sem mostrar a senha)
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
      const maskedUrl = databaseUrl.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@');
      console.log('🔗 DATABASE_URL:', maskedUrl);
    } else {
      console.error('❌ DATABASE_URL not found in environment variables');
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

