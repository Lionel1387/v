import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPool, type Pool } from 'mysql2/promise';

export const DB = Symbol('DB');

// Pool de conexiones a MySQL, disponible en toda la app con @Inject(DB)
@Global()
@Module({
  providers: [
    {
      provide: DB,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Pool =>
        createPool({
          host: config.get('DB_HOST', '127.0.0.1'),
          port: Number(config.get('DB_PORT', 3306)),
          user: config.getOrThrow('DB_USER'),
          password: config.getOrThrow('DB_PASSWORD'),
          database: config.getOrThrow('DB_NAME'),
          connectionLimit: 5,
          // DECIMAL llega como número y no como texto
          decimalNumbers: true,
          // MySQL (en Docker) trabaja en UTC: las fechas se leen y escriben en UTC para que no se corran
          timezone: 'Z',
        }),
    },
  ],
  exports: [DB],
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(@Inject(DB) private readonly pool: Pool) {}

  async onApplicationShutdown() {
    await this.pool.end();
  }
}
