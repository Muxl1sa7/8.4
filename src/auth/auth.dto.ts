import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';
import { UserRole } from '../users/user.entity';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email manzil' })
  @IsEmail({}, { message: 'Email noto\'g\'ri formatda' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'To\'liq ism' })
  @IsString()
  @IsNotEmpty({ message: 'To\'liq ism kiritilishi shart' })
  fullName: string;

  @ApiProperty({
    example: 'Pass123!',
    description: 'Parol — kamida 8 ta belgi, 1 ta katta harf, 1 ta raqam',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Parol kamida 8 ta belgidan iborat bo\'lishi kerak' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)/, {
    message: 'Parolda kamida 1 ta katta harf va 1 ta raqam bo\'lishi kerak',
  })
  password: string;

  @ApiPropertyOptional({ example: '+998901234567', description: 'Telefon raqam' })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'superadmin@coffeedelivery.com', description: 'Email manzil' })
  @IsEmail({}, { message: 'Email noto\'g\'ri formatda' })
  email: string;

  @ApiProperty({ example: 'SuperAdmin123!', description: 'Parol' })
  @IsString()
  @IsNotEmpty({ message: 'Parol kiritilishi shart' })
  password: string;
}

export class CreateUserByAdminDto {
  @ApiProperty({ example: 'worker@coffee.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Ali Valiyev' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'Pass123!' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d)/, {
    message: 'Parolda kamida 1 ta katta harf va 1 ta raqam bo\'lishi kerak',
  })
  password: string;

  @ApiProperty({
    enum: [UserRole.ADMIN, UserRole.WORKER],
    example: UserRole.WORKER,
    description: 'Superadmin: admin yoki worker. Admin: faqat worker',
  })
  @IsEnum([UserRole.ADMIN, UserRole.WORKER], {
    message: 'Role admin yoki worker bo\'lishi kerak',
  })
  role: UserRole;

  @ApiPropertyOptional({ example: '+998901234567' })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class UserResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() email: string;
  @ApiProperty() fullName: string;
  @ApiProperty({ enum: UserRole }) role: UserRole;
  @ApiProperty() isActive: boolean;
  @ApiPropertyOptional() phone?: string;
  @ApiProperty() createdAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  access_token: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
