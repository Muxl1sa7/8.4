import { User } from '../users/user.entity';
export declare enum OrderStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    PREPARING = "preparing",
    DELIVERING = "delivering",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export declare enum PaymentMethod {
    CREDIT_CARD = "credit_card",
    DEBIT_CARD = "debit_card",
    CASH = "cash"
}
export declare class OrderItem {
    coffeeId: string;
    coffeeName: string;
    quantity: number;
    price: number;
}
export declare class Order {
    id: string;
    customer: User;
    customerId: string;
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    createdAt: Date;
    updatedAt: Date;
}
