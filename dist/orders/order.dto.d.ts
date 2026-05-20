import { OrderStatus, PaymentMethod } from './order.entity';
export declare class CreateOrderItemDto {
    coffeeId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    items: CreateOrderItemDto[];
    paymentMethod: PaymentMethod;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
}
export declare class UpdateOrderStatusDto {
    status: OrderStatus;
}
