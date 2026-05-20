import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, CreateUserByAdminDto } from './auth.dto';
import { User, UserRole } from '../users/user.entity';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    getProfile(user: User): Promise<User>;
    createUser(dto: CreateUserByAdminDto, user: User): Promise<any>;
    getAllUsers(user: User): Promise<User[]>;
    toggleStatus(id: string, user: User): Promise<{
        message: string;
        user: User;
    }>;
}
