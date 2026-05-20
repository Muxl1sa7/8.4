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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./order.entity");
const coffee_entity_1 = require("../coffees/coffee.entity");
const user_entity_1 = require("../users/user.entity");
let OrdersService = class OrdersService {
    constructor(orderRepository, coffeeRepository) {
        this.orderRepository = orderRepository;
        this.coffeeRepository = coffeeRepository;
    }
    async create(dto, customer) {
        const orderItems = [];
        let subtotal = 0;
        for (const item of dto.items) {
            const coffee = await this.coffeeRepository.findOne({ where: { id: item.coffeeId } });
            if (!coffee)
                throw new common_1.NotFoundException(`Qahva topilmadi: ${item.coffeeId}`);
            if (!coffee.isAvailable)
                throw new common_1.BadRequestException(`${coffee.name} hozir mavjud emas`);
            if (coffee.stock < item.quantity) {
                throw new common_1.BadRequestException(`${coffee.name} zaxirasi yetarli emas (mavjud: ${coffee.stock})`);
            }
            const itemTotal = Number(coffee.price) * item.quantity;
            subtotal += itemTotal;
            orderItems.push({
                coffeeId: coffee.id,
                coffeeName: coffee.name,
                quantity: item.quantity,
                price: Number(coffee.price),
            });
            coffee.stock -= item.quantity;
            await this.coffeeRepository.save(coffee);
        }
        const deliveryFee = 3.5;
        const total = subtotal + deliveryFee;
        const order = this.orderRepository.create({
            ...dto,
            customerId: customer.id,
            items: orderItems,
            subtotal,
            deliveryFee,
            total,
        });
        return this.orderRepository.save(order);
    }
    async findAll(user) {
        if (user.role === user_entity_1.UserRole.CUSTOMER) {
            return this.orderRepository.find({
                where: { customerId: user.id },
                relations: ['customer'],
                order: { createdAt: 'DESC' },
            });
        }
        return this.orderRepository.find({
            relations: ['customer'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id, user) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['customer'],
        });
        if (!order)
            throw new common_1.NotFoundException('Buyurtma topilmadi');
        if (user.role === user_entity_1.UserRole.CUSTOMER && order.customerId !== user.id) {
            throw new common_1.ForbiddenException('Bu buyurtmani ko\'rish huquqi yo\'q');
        }
        return order;
    }
    async updateStatus(id, dto, user) {
        const order = await this.findOne(id, user);
        if (user.role === user_entity_1.UserRole.CUSTOMER) {
            if (order.customerId !== user.id) {
                throw new common_1.ForbiddenException('Ruxsat yo\'q');
            }
            if (dto.status !== order_entity_1.OrderStatus.CANCELLED) {
                throw new common_1.ForbiddenException('Siz faqat buyurtmani bekor qila olasiz');
            }
            if (order.status !== order_entity_1.OrderStatus.PENDING) {
                throw new common_1.BadRequestException('Faqat kutilayotgan buyurtmani bekor qilish mumkin');
            }
        }
        order.status = dto.status;
        return this.orderRepository.save(order);
    }
    async getStats(user) {
        if (user.role === user_entity_1.UserRole.CUSTOMER) {
            throw new common_1.ForbiddenException('Statistika faqat xodimlar uchun');
        }
        const total = await this.orderRepository.count();
        const pending = await this.orderRepository.count({ where: { status: order_entity_1.OrderStatus.PENDING } });
        const confirmed = await this.orderRepository.count({ where: { status: order_entity_1.OrderStatus.CONFIRMED } });
        const preparing = await this.orderRepository.count({ where: { status: order_entity_1.OrderStatus.PREPARING } });
        const delivering = await this.orderRepository.count({ where: { status: order_entity_1.OrderStatus.DELIVERING } });
        const delivered = await this.orderRepository.count({ where: { status: order_entity_1.OrderStatus.DELIVERED } });
        const cancelled = await this.orderRepository.count({ where: { status: order_entity_1.OrderStatus.CANCELLED } });
        const revenueResult = await this.orderRepository
            .createQueryBuilder('order')
            .select('SUM(order.total)', 'revenue')
            .where('order.status = :status', { status: order_entity_1.OrderStatus.DELIVERED })
            .getRawOne();
        return {
            total,
            byStatus: { pending, confirmed, preparing, delivering, delivered, cancelled },
            revenue: Number(revenueResult?.revenue || 0).toFixed(2),
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(coffee_entity_1.Coffee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map