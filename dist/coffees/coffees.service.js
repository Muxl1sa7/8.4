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
exports.CoffeesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const coffee_entity_1 = require("./coffee.entity");
const user_entity_1 = require("../users/user.entity");
let CoffeesService = class CoffeesService {
    constructor(coffeeRepository) {
        this.coffeeRepository = coffeeRepository;
    }
    async findAll() {
        return this.coffeeRepository.find({ order: { createdAt: 'DESC' } });
    }
    async findOne(id) {
        const coffee = await this.coffeeRepository.findOne({ where: { id } });
        if (!coffee)
            throw new common_1.NotFoundException('Qahva topilmadi');
        return coffee;
    }
    async create(dto) {
        const coffee = this.coffeeRepository.create(dto);
        return this.coffeeRepository.save(coffee);
    }
    async update(id, dto) {
        const coffee = await this.findOne(id);
        Object.assign(coffee, dto);
        return this.coffeeRepository.save(coffee);
    }
    async remove(id) {
        const coffee = await this.findOne(id);
        await this.coffeeRepository.remove(coffee);
        return { message: 'Qahva muvaffaqiyatli o\'chirildi' };
    }
    async seedCoffees(currentUser) {
        if (currentUser.role !== user_entity_1.UserRole.SUPERADMIN) {
            throw new common_1.ForbiddenException('Faqat superadmin seed qila oladi');
        }
        const coffees = [
            { name: 'Espresso', description: 'Kuchli va quyuq espresso, kofein sevuvchilar uchun', price: 3.5, tags: ['traditional', 'hot', 'strong'], stock: 100 },
            { name: 'Americano', description: 'Espresso va issiq suv aralashmasi, yumshoq ta\'m', price: 4.0, tags: ['traditional', 'hot', 'black'], stock: 100 },
            { name: 'Cappuccino', description: 'Espresso, bug\'langan sut va sut ko\'pigi', price: 5.5, tags: ['milky', 'hot', 'traditional'], stock: 100 },
            { name: 'Latte', description: 'Ko\'p sut va espresso — yumshoq va kremli', price: 5.99, tags: ['milky', 'hot'], stock: 100 },
            { name: 'Flat White', description: 'Avstralik uslub — kuchli espresso va silliq sut', price: 5.5, tags: ['milky', 'hot', 'special'], stock: 100 },
            { name: 'Macchiato', description: 'Espresso ustiga bir oz sut ko\'pigi', price: 4.5, tags: ['traditional', 'hot'], stock: 100 },
            { name: 'Mocha', description: 'Espresso, kakao va bug\'langan sut', price: 6.5, tags: ['milky', 'hot', 'chocolate'], stock: 100 },
            { name: 'Cold Brew', description: '24 soat sovuq suvda dmlangan qahva', price: 6.0, tags: ['cold', 'strong'], stock: 50 },
            { name: 'Iced Latte', description: 'Muzli latte — yozgi sevinch', price: 5.5, tags: ['cold', 'milky'], stock: 80 },
            { name: 'Frappe', description: 'Muzlatilgan qahva kokteyli', price: 7.0, tags: ['cold', 'milky', 'sweet'], stock: 60 },
            { name: 'Turkish Coffee', description: 'An\'anaviy turk usulida tayyorlangan qahva', price: 4.0, tags: ['traditional', 'hot', 'strong'], stock: 100 },
            { name: 'Cortado', description: 'Teng miqdorda espresso va bug\'langan sut', price: 4.99, tags: ['milky', 'hot', 'special'], stock: 80 },
            { name: 'Affogato', description: 'Espresso ustiga muzdek muzqaymoq', price: 7.5, tags: ['cold', 'sweet', 'special'], stock: 40 },
            { name: 'Vienna Coffee', description: 'Espresso ustiga qaymoq — Vena uslubi', price: 6.0, tags: ['hot', 'creamy', 'special'], stock: 70 },
        ];
        const results = [];
        for (const coffeeData of coffees) {
            const existing = await this.coffeeRepository.findOne({ where: { name: coffeeData.name } });
            if (!existing) {
                const coffee = this.coffeeRepository.create({ ...coffeeData, isAvailable: true });
                results.push(await this.coffeeRepository.save(coffee));
            }
        }
        return {
            message: `${results.length} ta yangi qahva qo'shildi (${coffees.length - results.length} ta allaqachon mavjud edi)`,
            added: results.length,
            total: coffees.length,
        };
    }
};
exports.CoffeesService = CoffeesService;
exports.CoffeesService = CoffeesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(coffee_entity_1.Coffee)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CoffeesService);
//# sourceMappingURL=coffees.service.js.map