import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../users/user.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  DELIVERING = 'delivering',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  CASH = 'cash',
}

export class OrderItem {
  @ApiProperty() coffeeId: string;
  @ApiProperty() coffeeName: string;
  @ApiProperty() quantity: number;
  @ApiProperty() price: number;
}

@Entity('orders')
export class Order {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'customer_id' })
  customer: User;

  @Column({ name: 'customer_id' })
  customerId: string;

  @ApiProperty({ type: [OrderItem] })
  @Column({ type: 'jsonb' })
  items: OrderItem[];

  @ApiProperty({ example: 15.99 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @ApiProperty({ example: 3.5 })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 3.5 })
  deliveryFee: number;

  @ApiProperty({ example: 19.49 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @ApiProperty({ enum: OrderStatus })
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @ApiProperty({ enum: PaymentMethod })
  @Column({ type: 'enum', enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @ApiProperty({ example: "Navoiy ko'chasi" })
  @Column()
  street: string;

  @ApiProperty({ example: '15' })
  @Column()
  number: string;

  @ApiPropertyOptional({ example: 'Apt 4B' })
  @Column({ nullable: true })
  complement: string;

  @ApiProperty({ example: 'Yunusobod' })
  @Column()
  neighborhood: string;

  @ApiProperty({ example: 'Toshkent' })
  @Column()
  city: string;

  @ApiProperty({ example: 'TK' })
  @Column({ length: 2 })
  state: string;

  @ApiProperty({ example: '100000' })
  @Column()
  zipCode: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
