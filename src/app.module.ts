import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AdminController } from './api/admin/admin.controller';
import { OrderController } from './api/order/order.controller';
import { dbImports, dbProviders } from './db/_index';
import { AuthMiddleware } from './middleware/auth.middleware';
import { AdminAuthMiddleware } from './middleware/admin.auth.middleware';
import { LoggerMiddleware } from './middleware/logger.middleware';
import Formatter from 'src/lib/formatter/_index';

@Module({
  imports: [...dbImports, ConfigModule.forRoot()],
  controllers: [AdminController, OrderController],
  providers: [...dbProviders, Formatter],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AdminAuthMiddleware).forRoutes(AdminController);
    consumer.apply(LoggerMiddleware, AuthMiddleware).forRoutes(OrderController);
  }
}
