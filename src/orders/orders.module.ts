import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './order.entity';
import { Coffee } from '../coffees/coffee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Coffee])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
