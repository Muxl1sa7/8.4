import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { Coffee } from '../coffees/coffee.entity';
import { User, UserRole } from '../users/user.entity';
import { CreateOrderDto, UpdateOrderStatusDto } from './order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Coffee)
    private coffeeRepository: Repository<Coffee>,
  ) {}

  async create(dto: CreateOrderDto, customer: User) {
    const orderItems = [];
    let subtotal = 0;

    for (const item of dto.items) {
      const coffee = await this.coffeeRepository.findOne({ where: { id: item.coffeeId } });
      if (!coffee) throw new NotFoundException(`Qahva topilmadi: ${item.coffeeId}`);
      if (!coffee.isAvailable) throw new BadRequestException(`${coffee.name} hozir mavjud emas`);
      if (coffee.stock < item.quantity) {
        throw new BadRequestException(`${coffee.name} zaxirasi yetarli emas (mavjud: ${coffee.stock})`);
      }

      const itemTotal = Number(coffee.price) * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        coffeeId: coffee.id,
        coffeeName: coffee.name,
        quantity: item.quantity,
        price: Number(coffee.price),
      });

      // Update stock
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

  async findAll(user: User) {
    if (user.role === UserRole.CUSTOMER) {
      return this.orderRepository.find({
        where: { customerId: user.id },
        relations: ['customer'],
        order: { createdAt: 'DESC' },
      });
    }
    // Admin, Worker, Superadmin can see all orders
    return this.orderRepository.find({
      relations: ['customer'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, user: User) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer'],
    });
    if (!order) throw new NotFoundException('Buyurtma topilmadi');

    // Customer can only see own orders
    if (user.role === UserRole.CUSTOMER && order.customerId !== user.id) {
      throw new ForbiddenException('Bu buyurtmani ko\'rish huquqi yo\'q');
    }

    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto, user: User) {
    const order = await this.findOne(id, user);

    // Customer can only cancel own pending orders
    if (user.role === UserRole.CUSTOMER) {
      if (order.customerId !== user.id) {
        throw new ForbiddenException('Ruxsat yo\'q');
      }
      if (dto.status !== OrderStatus.CANCELLED) {
        throw new ForbiddenException('Siz faqat buyurtmani bekor qila olasiz');
      }
      if (order.status !== OrderStatus.PENDING) {
        throw new BadRequestException('Faqat kutilayotgan buyurtmani bekor qilish mumkin');
      }
    }

    order.status = dto.status;
    return this.orderRepository.save(order);
  }

  async getStats(user: User) {
    if (user.role === UserRole.CUSTOMER) {
      throw new ForbiddenException('Statistika faqat xodimlar uchun');
    }

    const total = await this.orderRepository.count();
    const pending = await this.orderRepository.count({ where: { status: OrderStatus.PENDING } });
    const confirmed = await this.orderRepository.count({ where: { status: OrderStatus.CONFIRMED } });
    const preparing = await this.orderRepository.count({ where: { status: OrderStatus.PREPARING } });
    const delivering = await this.orderRepository.count({ where: { status: OrderStatus.DELIVERING } });
    const delivered = await this.orderRepository.count({ where: { status: OrderStatus.DELIVERED } });
    const cancelled = await this.orderRepository.count({ where: { status: OrderStatus.CANCELLED } });

    const revenueResult = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'revenue')
      .where('order.status = :status', { status: OrderStatus.DELIVERED })
      .getRawOne();

    return {
      total,
      byStatus: { pending, confirmed, preparing, delivering, delivered, cancelled },
      revenue: Number(revenueResult?.revenue || 0).toFixed(2),
    };
  }
}
