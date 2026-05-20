"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const user_entity_1 = require("../users/user.entity");
let AuthService = class AuthService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const existing = await this.userRepository.findOne({ where: { email: dto.email } });
        if (existing) {
            throw new common_1.ConflictException('Bu email allaqachon ro\'yxatdan o\'tgan');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = this.userRepository.create({
            ...dto,
            password: hashedPassword,
            role: user_entity_1.UserRole.CUSTOMER,
        });
        await this.userRepository.save(user);
        return this.generateResponse(user);
    }
    async login(dto) {
        const user = await this.userRepository.findOne({
            where: { email: dto.email },
            select: ['id', 'email', 'fullName', 'role', 'isActive', 'password', 'phone', 'createdAt', 'updatedAt'],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Email yoki parol noto\'g\'ri');
        }
        if (!user.isActive) {
            throw new common_1.ForbiddenException('Hisobingiz bloklangan. Admin bilan bog\'laning');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Email yoki parol noto\'g\'ri');
        }
        return this.generateResponse(user);
    }
    async createUserByAdmin(dto, currentUser) {
        if (dto.role === user_entity_1.UserRole.ADMIN && currentUser.role !== user_entity_1.UserRole.SUPERADMIN) {
            throw new common_1.ForbiddenException('Admin tayinlash faqat superadmin uchun mumkin');
        }
        if (currentUser.role === user_entity_1.UserRole.ADMIN && dto.role !== user_entity_1.UserRole.WORKER) {
            throw new common_1.ForbiddenException('Admin faqat ishchi (worker) yarata oladi');
        }
        const existing = await this.userRepository.findOne({ where: { email: dto.email } });
        if (existing) {
            throw new common_1.ConflictException('Bu email allaqachon mavjud');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = this.userRepository.create({
            ...dto,
            password: hashedPassword,
        });
        await this.userRepository.save(user);
        const { password, ...result } = user;
        return result;
    }
    async getProfile(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('Foydalanuvchi topilmadi');
        return user;
    }
    async getAllUsers(currentUser) {
        if (currentUser.role === user_entity_1.UserRole.SUPERADMIN) {
            return this.userRepository.find({ order: { createdAt: 'DESC' } });
        }
        return this.userRepository.find({
            where: { role: user_entity_1.UserRole.WORKER },
            order: { createdAt: 'DESC' },
        });
    }
    async toggleUserStatus(userId, currentUser) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('Foydalanuvchi topilmadi');
        if (user.role === user_entity_1.UserRole.SUPERADMIN) {
            throw new common_1.ForbiddenException('Superadminni bloklash mumkin emas');
        }
        if (currentUser.role === user_entity_1.UserRole.ADMIN && user.role === user_entity_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('Admin boshqa adminni o\'zgartira olmaydi');
        }
        user.isActive = !user.isActive;
        await this.userRepository.save(user);
        return {
            message: `Foydalanuvchi ${user.isActive ? 'faollashtirildi ✅' : 'bloklandi 🚫'}`,
            user,
        };
    }
    generateResponse(user) {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map