import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus, PaymentMethod } from './order.entity';

export class CreateOrderItemDto {
  @ApiProperty({ example: 'uuid-coffee-id', description: 'Qahva ID' })
  @IsUUID()
  coffeeId: string;

  @ApiProperty({ example: 2, description: 'Miqdori' })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [CreateOrderItemDto], description: 'Buyurtma elementlari' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.CASH })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({ example: "Navoiy ko'chasi", description: 'Ko\'cha nomi' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ example: '15', description: 'Uy raqami' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiPropertyOptional({ example: 'Apt 4B', description: 'Qo\'shimcha' })
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiProperty({ example: 'Yunusobod', description: 'Mahalla' })
  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @ApiProperty({ example: 'Toshkent', description: 'Shahar' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'TK', description: 'Viloyat kodi (2 harf)', maxLength: 2 })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: '100000', description: 'Pochta indeksi' })
  @IsString()
  @IsNotEmpty()
  zipCode: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.CONFIRMED,
    description: 'Yangi status',
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
