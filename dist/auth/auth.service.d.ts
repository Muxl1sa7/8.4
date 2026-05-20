import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '../users/user.entity';
import { RegisterDto, LoginDto, CreateUserByAdminDto } from './auth.dto';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            role: UserRole;
            isActive: boolean;
            phone: string;
            createdAt: Date;
        };
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            fullName: string;
            role: UserRole;
            isActive: boolean;
            phone: string;
            createdAt: Date;
        };
    }>;
    createUserByAdmin(dto: CreateUserByAdminDto, currentUser: User): Promise<any>;
    getProfile(userId: string): Promise<User>;
    getAllUsers(currentUser: User): Promise<User[]>;
    toggleUserStatus(userId: string, currentUser: User): Promise<{
        message: string;
        user: User;
    }>;
    private generateResponse;
}
