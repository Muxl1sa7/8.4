import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  WORKER = 'worker',
  CUSTOMER = 'customer',
}

@Entity('users')
export class User {
  @ApiProperty({ example: 'uuid-here', description: 'Unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  @Column()
  fullName: string;

  @Column({ select: false })
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CUSTOMER })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @ApiProperty({ example: true })
  @Column({ default: true })
  isActive: boolean;

  @ApiPropertyOptional({ example: '+998901234567' })
  @Column({ nullable: true })
  phone: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
