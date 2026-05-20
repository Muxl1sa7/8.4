export declare class CreateCoffeeDto {
    name: string;
    description: string;
    price: number;
    image?: string;
    tags?: string[];
    isAvailable?: boolean;
    stock?: number;
}
declare const UpdateCoffeeDto_base: import("@nestjs/common").Type<Partial<CreateCoffeeDto>>;
export declare class UpdateCoffeeDto extends UpdateCoffeeDto_base {
}
export {};
