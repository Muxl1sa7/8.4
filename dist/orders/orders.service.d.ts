import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { Coffee } from '../coffees/coffee.entity';
import { User } from '../users/user.entity';
import { CreateOrderDto, UpdateOrderStatusDto } from './order.dto';
export declare class OrdersService {
    private orderRepository;
    private coffeeRepository;
    constructor(orderRepository: Repository<Order>, coffeeRepository: Repository<Coffee>);
    create(dto: CreateOrderDto, customer: User): Promise<Order>;
    findAll(user: User): Promise<Order[]>;
    findOne(id: string, user: User): Promise<Order>;
    updateStatus(id: string, dto: UpdateOrderStatusDto, user: User): Promise<Order>;
    getStats(user: User): Promise<{
        total: number;
        byStatus: {
            pending: number;
            confirmed: number;
            preparing: number;
            delivering: number;
            delivered: number;
            cancelled: number;
        };
        revenue: string;
    }>;
}
