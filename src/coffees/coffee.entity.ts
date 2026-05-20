import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('coffees')
export class Coffee {
  @ApiProperty({ example: 'uuid-here' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Espresso' })
  @Column()
  name: string;

  @ApiProperty({ example: 'Strong and bold espresso' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ example: 5.99 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ApiPropertyOptional({ example: 'https://example.com/coffee.jpg' })
  @Column({ nullable: true })
  image: string;

  @ApiProperty({ example: ['hot', 'strong'], type: [String] })
  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @ApiProperty({ example: true })
  @Column({ default: true })
  isAvailable: boolean;

  @ApiProperty({ example: 100 })
  @Column({ default: 0 })
  stock: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
