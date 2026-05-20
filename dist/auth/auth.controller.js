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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("./auth.dto");
const guards_1 = require("../common/guards");
const user_entity_1 = require("../users/user.entity");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    register(dto) {
        return this.authService.register(dto);
    }
    login(dto) {
        return this.authService.login(dto);
    }
    getProfile(user) {
        return this.authService.getProfile(user.id);
    }
    createUser(dto, user) {
        return this.authService.createUserByAdmin(dto, user);
    }
    getAllUsers(user) {
        return this.authService.getAllUsers(user);
    }
    toggleStatus(id, user) {
        return this.authService.toggleUserStatus(id, user);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({
        summary: 'Ro\'yxatdan o\'tish (Customer)',
        description: 'Yangi mijoz sifatida ro\'yxatdan o\'ting. Role avtomatik **CUSTOMER** bo\'ladi.\n\n' +
            'Admin va Worker yaratish uchun `POST /auth/create-user` endpointidan foydalaning.',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, type: auth_dto_1.AuthResponseDto, description: 'Muvaffaqiyatli ro\'yxatdan o\'tildi' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation xatosi' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Bu email allaqachon ro\'yxatdan o\'tgan' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RegisterDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Tizimga kirish',
        description: 'Barcha foydalanuvchilar (superadmin, admin, worker, customer) shu endpoint orqali kiradi.\n\n' +
            '**Default Superadmin:**\n```\nEmail: superadmin@coffeedelivery.com\nPassword: SuperAdmin123!\n```',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: auth_dto_1.AuthResponseDto, description: 'Muvaffaqiyatli kirish' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Email yoki parol noto\'g\'ri' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Hisob bloklangan' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('bearerAuth'),
    (0, swagger_1.ApiOperation)({ summary: 'O\'z profilini ko\'rish', description: 'JWT token talab qilinadi' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: auth_dto_1.UserResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Token yaroqsiz' }),
    __param(0, (0, guards_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('create-user'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, guards_1.Roles)(user_entity_1.UserRole.SUPERADMIN, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)('bearerAuth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Foydalanuvchi yaratish (Admin/Superadmin)',
        description: '**Superadmin** → Admin va Worker yarata oladi.\n\n**Admin** → Faqat Worker yarata oladi.\n\nCustomer rol bilan yaratib bo\'lmaydi — u faqat `/auth/register` orqali ro\'yxatdan o\'tadi.',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, type: auth_dto_1.UserResponseDto, description: 'Foydalanuvchi yaratildi' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Ruxsat yo\'q' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Email allaqachon mavjud' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, guards_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.CreateUserByAdminDto, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "createUser", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, guards_1.Roles)(user_entity_1.UserRole.SUPERADMIN, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)('bearerAuth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Barcha foydalanuvchilarni ko\'rish',
        description: '**Superadmin** → hammani ko\'radi. **Admin** → faqat workerlarni ko\'radi.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [auth_dto_1.UserResponseDto] }),
    __param(0, (0, guards_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Patch)('users/:id/toggle-status'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, guards_1.Roles)(user_entity_1.UserRole.SUPERADMIN, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)('bearerAuth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Foydalanuvchini bloklash / faollashtirish',
        description: 'isActive ni teskari qiladi. Superadminni bloklash mumkin emas.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Foydalanuvchi UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status o\'zgartirildi' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Ruxsat yo\'q' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Foydalanuvchi topilmadi' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, guards_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "toggleStatus", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('🔐 Auth & Users'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map