import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coffee } from './coffee.entity';
import { CreateCoffeeDto, UpdateCoffeeDto } from './coffee.dto';
import { User, UserRole } from '../users/user.entity';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private coffeeRepository: Repository<Coffee>,
  ) {}

  async findAll() {
    return this.coffeeRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const coffee = await this.coffeeRepository.findOne({ where: { id } });
    if (!coffee) throw new NotFoundException('Qahva topilmadi');
    return coffee;
  }

  async create(dto: CreateCoffeeDto) {
    const coffee = this.coffeeRepository.create(dto);
    return this.coffeeRepository.save(coffee);
  }

  async update(id: string, dto: UpdateCoffeeDto) {
    const coffee = await this.findOne(id);
    Object.assign(coffee, dto);
    return this.coffeeRepository.save(coffee);
  }

  async remove(id: string) {
    const coffee = await this.findOne(id);
    await this.coffeeRepository.remove(coffee);
    return { message: 'Qahva muvaffaqiyatli o\'chirildi' };
  }

  async seedCoffees(currentUser: User) {
    if (currentUser.role !== UserRole.SUPERADMIN) {
      throw new ForbiddenException('Faqat superadmin seed qila oladi');
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
}
