import {
  Controller,
  Get,
  Post,
  Patch,
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
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './order.dto';
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../common/guards';
import { User, UserRole } from '../users/user.entity';

@ApiTags('📦 Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('bearerAuth')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @ApiOperation({
    summary: 'Buyurtma berish',
    description: 'Tizimga kirgan foydalanuvchi buyurtma bera oladi',
  })
  @ApiResponse({ status: 201, description: 'Buyurtma muvaffaqiyatli yaratildi' })
  @ApiResponse({ status: 400, description: 'Zaxira yetarli emas yoki qahva mavjud emas' })
  @ApiResponse({ status: 401, description: 'Autentifikatsiya talab qilinadi' })
  create(@Body() dto: CreateOrderDto, @CurrentUser() user: User) {
    return this.ordersService.create(dto, user);
  }

  @Get()
  @ApiOperation({
    summary: 'Buyurtmalar ro\'yxati',
    description: '**Customer** → faqat o\'z buyurtmalari. **Admin/Worker/Superadmin** → barcha buyurtmalar.',
  })
  @ApiResponse({ status: 200, description: 'Buyurtmalar ro\'yxati' })
  findAll(@CurrentUser() user: User) {
    return this.ordersService.findAll(user);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN, UserRole.WORKER)
  @ApiOperation({
    summary: 'Buyurtmalar statistikasi (Admin/Worker/Superadmin)',
    description: 'Status bo\'yicha hisobot va umumiy daromad',
  })
  @ApiResponse({ status: 200, description: 'Statistika ma\'lumotlari' })
  getStats(@CurrentUser() user: User) {
    return this.ordersService.getStats(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta buyurtma ma\'lumoti' })
  @ApiParam({ name: 'id', description: 'Buyurtma UUID' })
  @ApiResponse({ status: 200, description: 'Buyurtma ma\'lumoti' })
  @ApiResponse({ status: 404, description: 'Buyurtma topilmadi' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.ordersService.findOne(id, user);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Buyurtma statusini yangilash',
    description:
      '**Customer** → faqat CANCELLED qila oladi (pending holatida).\n\n**Worker/Admin/Superadmin** → barcha statuslarni o\'zgartira oladi.',
  })
  @ApiParam({ name: 'id', description: 'Buyurtma UUID' })
  @ApiResponse({ status: 200, description: 'Status yangilandi' })
  @ApiResponse({ status: 403, description: 'Ruxsat yo\'q' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
    @CurrentUser() user: User,
  ) {
    return this.ordersService.updateStatus(id, dto, user);
  }
}
