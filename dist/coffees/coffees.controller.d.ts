import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto, UpdateCoffeeDto } from './coffee.dto';
import { Coffee } from './coffee.entity';
import { User } from '../users/user.entity';
export declare class CoffeesController {
    private coffeesService;
    constructor(coffeesService: CoffeesService);
    findAll(): Promise<Coffee[]>;
    findOne(id: string): Promise<Coffee>;
    create(dto: CreateCoffeeDto): Promise<Coffee>;
    update(id: string, dto: UpdateCoffeeDto): Promise<Coffee>;
    remove(id: string): Promise<{
        message: string;
    }>;
    seed(user: User): Promise<{
        message: string;
        added: number;
        total: number;
    }>;
}
