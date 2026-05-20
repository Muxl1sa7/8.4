import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto, UpdateCoffeeDto } from './coffee.dto';
import { Coffee } from './coffee.entity';
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../common/guards';
import { User, UserRole } from '../users/user.entity';

@ApiTags('☕ Coffees')
@Controller('coffees')
export class CoffeesController {
  constructor(private coffeesService: CoffeesService) {}

  @Get()
  @ApiOperation({ summary: 'Barcha qahvalar ro\'yxati', description: 'Hamma ko\'ra oladi' })
  @ApiResponse({ status: 200, type: [Coffee] })
  findAll() {
    return this.coffeesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta qahva ma\'lumoti' })
  @ApiParam({ name: 'id', description: 'Qahva UUID' })
  @ApiResponse({ status: 200, type: Coffee })
  @ApiResponse({ status: 404, description: 'Qahva topilmadi' })
  findOne(@Param('id') id: string) {
    return this.coffeesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Yangi qahva qo\'shish (Admin/Superadmin)' })
  @ApiResponse({ status: 201, type: Coffee })
  create(@Body() dto: CreateCoffeeDto) {
    return this.coffeesService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Qahvani yangilash (Admin/Superadmin)' })
  @ApiParam({ name: 'id', description: 'Qahva UUID' })
  @ApiResponse({ status: 200, type: Coffee })
  update(@Param('id') id: string, @Body() dto: UpdateCoffeeDto) {
    return this.coffeesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'Qahvani o\'chirish (faqat Superadmin)' })
  @ApiParam({ name: 'id', description: 'Qahva UUID' })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli o\'chirildi' })
  remove(@Param('id') id: string) {
    return this.coffeesService.remove(id);
  }

  @Post('seed')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({
    summary: '14 ta namunaviy qahva yuklash (faqat Superadmin)',
    description: 'Boshlang\'ich qahvalar katalogini to\'ldirish uchun',
  })
  seed(@CurrentUser() user: User) {
    return this.coffeesService.seedCoffees(user);
  }
}
