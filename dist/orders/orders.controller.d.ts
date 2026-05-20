import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './order.dto';
import { User } from '../users/user.entity';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    create(dto: CreateOrderDto, user: User): Promise<import("./order.entity").Order>;
    findAll(user: User): Promise<import("./order.entity").Order[]>;
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
    findOne(id: string, user: User): Promise<import("./order.entity").Order>;
    updateStatus(id: string, dto: UpdateOrderStatusDto, user: User): Promise<import("./order.entity").Order>;
}
