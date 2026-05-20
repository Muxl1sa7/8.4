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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const orders_service_1 = require("./orders.service");
const order_dto_1 = require("./order.dto");
const guards_1 = require("../common/guards");
const user_entity_1 = require("../users/user.entity");
let OrdersController = class OrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    create(dto, user) {
        return this.ordersService.create(dto, user);
    }
    findAll(user) {
        return this.ordersService.findAll(user);
    }
    getStats(user) {
        return this.ordersService.getStats(user);
    }
    findOne(id, user) {
        return this.ordersService.findOne(id, user);
    }
    updateStatus(id, dto, user) {
        return this.ordersService.updateStatus(id, dto, user);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Buyurtma berish',
        description: 'Tizimga kirgan foydalanuvchi buyurtma bera oladi',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Buyurtma muvaffaqiyatli yaratildi' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Zaxira yetarli emas yoki qahva mavjud emas' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Autentifikatsiya talab qilinadi' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, guards_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_dto_1.CreateOrderDto, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Buyurtmalar ro\'yxati',
        description: '**Customer** → faqat o\'z buyurtmalari. **Admin/Worker/Superadmin** → barcha buyurtmalar.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Buyurtmalar ro\'yxati' }),
    __param(0, (0, guards_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(guards_1.RolesGuard),
    (0, guards_1.Roles)(user_entity_1.UserRole.SUPERADMIN, user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.WORKER),
    (0, swagger_1.ApiOperation)({
        summary: 'Buyurtmalar statistikasi (Admin/Worker/Superadmin)',
        description: 'Status bo\'yicha hisobot va umumiy daromad',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistika ma\'lumotlari' }),
    __param(0, (0, guards_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Bitta buyurtma ma\'lumoti' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Buyurtma UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Buyurtma ma\'lumoti' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Buyurtma topilmadi' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, guards_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_1.User]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({
        summary: 'Buyurtma statusini yangilash',
        description: '**Customer** → faqat CANCELLED qila oladi (pending holatida).\n\n**Worker/Admin/Superadmin** → barcha statuslarni o\'zgartira oladi.',
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Buyurtma UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Status yangilandi' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Ruxsat yo\'q' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, guards_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, order_dto_1.UpdateOrderStatusDto,
        user_entity_1.User]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateStatus", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('📦 Orders'),
    (0, common_1.Controller)('orders'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('bearerAuth'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map