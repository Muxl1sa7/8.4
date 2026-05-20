import { Repository } from 'typeorm';
import { Coffee } from './coffee.entity';
import { CreateCoffeeDto, UpdateCoffeeDto } from './coffee.dto';
import { User } from '../users/user.entity';
export declare class CoffeesService {
    private coffeeRepository;
    constructor(coffeeRepository: Repository<Coffee>);
    findAll(): Promise<Coffee[]>;
    findOne(id: string): Promise<Coffee>;
    create(dto: CreateCoffeeDto): Promise<Coffee>;
    update(id: string, dto: UpdateCoffeeDto): Promise<Coffee>;
    remove(id: string): Promise<{
        message: string;
    }>;
    seedCoffees(currentUser: User): Promise<{
        message: string;
        added: number;
        total: number;
    }>;
}
