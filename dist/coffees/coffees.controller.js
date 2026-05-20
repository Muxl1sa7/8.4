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
exports.CoffeesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const coffees_service_1 = require("./coffees.service");
const coffee_dto_1 = require("./coffee.dto");
const coffee_entity_1 = require("./coffee.entity");
const guards_1 = require("../common/guards");
const user_entity_1 = require("../users/user.entity");
let CoffeesController = class CoffeesController {
    constructor(coffeesService) {
        this.coffeesService = coffeesService;
    }
    findAll() {
        return this.coffeesService.findAll();
    }
    findOne(id) {
        return this.coffeesService.findOne(id);
    }
    create(dto) {
        return this.coffeesService.create(dto);
    }
    update(id, dto) {
        return this.coffeesService.update(id, dto);
    }
    remove(id) {
        return this.coffeesService.remove(id);
    }
    seed(user) {
        return this.coffeesService.seedCoffees(user);
    }
};
exports.CoffeesController = CoffeesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Barcha qahvalar ro\'yxati', description: 'Hamma ko\'ra oladi' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [coffee_entity_1.Coffee] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CoffeesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Bitta qahva ma\'lumoti' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Qahva UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: coffee_entity_1.Coffee }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Qahva topilmadi' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CoffeesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, guards_1.Roles)(user_entity_1.UserRole.SUPERADMIN, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)('bearerAuth'),
    (0, swagger_1.ApiOperation)({ summary: 'Yangi qahva qo\'shish (Admin/Superadmin)' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: coffee_entity_1.Coffee }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [coffee_dto_1.CreateCoffeeDto]),
    __metadata("design:returntype", void 0)
], CoffeesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, guards_1.Roles)(user_entity_1.UserRole.SUPERADMIN, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)('bearerAuth'),
    (0, swagger_1.ApiOperation)({ summary: 'Qahvani yangilash (Admin/Superadmin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Qahva UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: coffee_entity_1.Coffee }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, coffee_dto_1.UpdateCoffeeDto]),
    __metadata("design:returntype", void 0)
], CoffeesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, guards_1.Roles)(user_entity_1.UserRole.SUPERADMIN),
    (0, swagger_1.ApiBearerAuth)('bearerAuth'),
    (0, swagger_1.ApiOperation)({ summary: 'Qahvani o\'chirish (faqat Superadmin)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Qahva UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Muvaffaqiyatli o\'chirildi' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CoffeesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('seed'),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard),
    (0, guards_1.Roles)(user_entity_1.UserRole.SUPERADMIN),
    (0, swagger_1.ApiBearerAuth)('bearerAuth'),
    (0, swagger_1.ApiOperation)({
        summary: '14 ta namunaviy qahva yuklash (faqat Superadmin)',
        description: 'Boshlang\'ich qahvalar katalogini to\'ldirish uchun',
    }),
    __param(0, (0, guards_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], CoffeesController.prototype, "seed", null);
exports.CoffeesController = CoffeesController = __decorate([
    (0, swagger_1.ApiTags)('☕ Coffees'),
    (0, common_1.Controller)('coffees'),
    __metadata("design:paramtypes", [coffees_service_1.CoffeesService])
], CoffeesController);
//# sourceMappingURL=coffees.controller.js.map