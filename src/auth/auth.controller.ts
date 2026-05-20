import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  CreateUserByAdminDto,
  AuthResponseDto,
  UserResponseDto,
} from './auth.dto';
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../common/guards';
import { User, UserRole } from '../users/user.entity';

@ApiTags('🔐 Auth & Users')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ─── PUBLIC ENDPOINTS ─────────────────────────────────────────────────────

  @Post('register')
  @ApiOperation({
    summary: 'Ro\'yxatdan o\'tish (Customer)',
    description:
      'Yangi mijoz sifatida ro\'yxatdan o\'ting. Role avtomatik **CUSTOMER** bo\'ladi.\n\n' +
      'Admin va Worker yaratish uchun `POST /auth/create-user` endpointidan foydalaning.',
  })
  @ApiResponse({ status: 201, type: AuthResponseDto, description: 'Muvaffaqiyatli ro\'yxatdan o\'tildi' })
  @ApiResponse({ status: 400, description: 'Validation xatosi' })
  @ApiResponse({ status: 409, description: 'Bu email allaqachon ro\'yxatdan o\'tgan' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Tizimga kirish',
    description:
      'Barcha foydalanuvchilar (superadmin, admin, worker, customer) shu endpoint orqali kiradi.\n\n' +
      '**Default Superadmin:**\n```\nEmail: superadmin@coffeedelivery.com\nPassword: SuperAdmin123!\n```',
  })
  @ApiResponse({ status: 200, type: AuthResponseDto, description: 'Muvaffaqiyatli kirish' })
  @ApiResponse({ status: 401, description: 'Email yoki parol noto\'g\'ri' })
  @ApiResponse({ status: 403, description: 'Hisob bloklangan' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // ─── PROTECTED ENDPOINTS ──────────────────────────────────────────────────

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: 'O\'z profilini ko\'rish', description: 'JWT token talab qilinadi' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Token yaroqsiz' })
  getProfile(@CurrentUser() user: User) {
    return this.authService.getProfile(user.id);
  }

  @Post('create-user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({
    summary: 'Foydalanuvchi yaratish (Admin/Superadmin)',
    description:
      '**Superadmin** → Admin va Worker yarata oladi.\n\n**Admin** → Faqat Worker yarata oladi.\n\nCustomer rol bilan yaratib bo\'lmaydi — u faqat `/auth/register` orqali ro\'yxatdan o\'tadi.',
  })
  @ApiResponse({ status: 201, type: UserResponseDto, description: 'Foydalanuvchi yaratildi' })
  @ApiResponse({ status: 403, description: 'Ruxsat yo\'q' })
  @ApiResponse({ status: 409, description: 'Email allaqachon mavjud' })
  createUser(@Body() dto: CreateUserByAdminDto, @CurrentUser() user: User) {
    return this.authService.createUserByAdmin(dto, user);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({
    summary: 'Barcha foydalanuvchilarni ko\'rish',
    description: '**Superadmin** → hammani ko\'radi. **Admin** → faqat workerlarni ko\'radi.',
  })
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  getAllUsers(@CurrentUser() user: User) {
    return this.authService.getAllUsers(user);
  }

  @Patch('users/:id/toggle-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN, UserRole.ADMIN)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({
    summary: 'Foydalanuvchini bloklash / faollashtirish',
    description: 'isActive ni teskari qiladi. Superadminni bloklash mumkin emas.',
  })
  @ApiParam({ name: 'id', description: 'Foydalanuvchi UUID' })
  @ApiResponse({ status: 200, description: 'Status o\'zgartirildi' })
  @ApiResponse({ status: 403, description: 'Ruxsat yo\'q' })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi' })
  toggleStatus(@Param('id') id: string, @CurrentUser() user: User) {
    return this.authService.toggleUserStatus(id, user);
  }
}
