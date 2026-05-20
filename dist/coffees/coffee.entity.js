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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coffee = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
let Coffee = class Coffee {
};
exports.Coffee = Coffee;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-here' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Coffee.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Espresso' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Coffee.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Strong and bold espresso' }),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Coffee.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5.99 }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Coffee.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://example.com/coffee.jpg' }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Coffee.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['hot', 'strong'], type: [String] }),
    (0, typeorm_1.Column)({ type: 'text', array: true, default: [] }),
    __metadata("design:type", Array)
], Coffee.prototype, "tags", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Coffee.prototype, "isAvailable", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Coffee.prototype, "stock", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Coffee.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Coffee.prototype, "updatedAt", void 0);
exports.Coffee = Coffee = __decorate([
    (0, typeorm_1.Entity)('coffees')
], Coffee);
//# sourceMappingURL=coffee.entity.js.map