import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CoffeesModule } from './coffees/coffees.module';
import { OrdersModule } from './orders/orders.module';
import { User } from './users/user.entity';
import { Coffee } from './coffees/coffee.entity';
import { Order } from './orders/order.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'coffee_delivery',
      entities: [User, Coffee, Order],
      synchronize: true, // Set to false in production!
      logging: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    CoffeesModule,
    OrdersModule,
  ],
})
export class AppModule {}
