import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../users/user.entity';
import { RegisterDto, LoginDto, CreateUserByAdminDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Bu email allaqachon ro\'yxatdan o\'tgan');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      ...dto,
      password: hashedPassword,
      role: UserRole.CUSTOMER,
    });

    await this.userRepository.save(user);
    return this.generateResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: ['id', 'email', 'fullName', 'role', 'isActive', 'password', 'phone', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new UnauthorizedException('Email yoki parol noto\'g\'ri');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Hisobingiz bloklangan. Admin bilan bog\'laning');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email yoki parol noto\'g\'ri');
    }

    return this.generateResponse(user);
  }

  async createUserByAdmin(dto: CreateUserByAdminDto, currentUser: User) {
    // Only superadmin can create admins
    if (dto.role === UserRole.ADMIN && currentUser.role !== UserRole.SUPERADMIN) {
      throw new ForbiddenException('Admin tayinlash faqat superadmin uchun mumkin');
    }

    // Admin can only create workers
    if (currentUser.role === UserRole.ADMIN && dto.role !== UserRole.WORKER) {
      throw new ForbiddenException('Admin faqat ishchi (worker) yarata oladi');
    }

    const existing = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Bu email allaqachon mavjud');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    await this.userRepository.save(user);
    const { password, ...result } = user as any;
    return result;
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
    return user;
  }

  async getAllUsers(currentUser: User) {
    if (currentUser.role === UserRole.SUPERADMIN) {
      return this.userRepository.find({ order: { createdAt: 'DESC' } });
    }
    // Admin can see workers only
    return this.userRepository.find({
      where: { role: UserRole.WORKER },
      order: { createdAt: 'DESC' },
    });
  }

  async toggleUserStatus(userId: string, currentUser: User) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

    if (user.role === UserRole.SUPERADMIN) {
      throw new ForbiddenException('Superadminni bloklash mumkin emas');
    }

    if (currentUser.role === UserRole.ADMIN && user.role === UserRole.ADMIN) {
      throw new ForbiddenException('Admin boshqa adminni o\'zgartira olmaydi');
    }

    user.isActive = !user.isActive;
    await this.userRepository.save(user);
    return {
      message: `Foydalanuvchi ${user.isActive ? 'faollashtirildi ✅' : 'bloklandi 🚫'}`,
      user,
    };
  }

  private generateResponse(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    };
  }
}
