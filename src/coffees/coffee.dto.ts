import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateCoffeeDto {
  @ApiProperty({ example: 'Espresso', description: 'Qahva nomi' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Kuchli va quyuq espresso', description: 'Tavsif' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 5.99, description: 'Narx (USD)' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 'https://example.com/coffee.jpg' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: ['hot', 'strong', 'traditional'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({ example: 100, description: 'Zaxira miqdori' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;
}

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {}
