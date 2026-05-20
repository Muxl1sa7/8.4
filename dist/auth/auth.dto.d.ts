import { UserRole } from '../users/user.entity';
export declare class RegisterDto {
    email: string;
    fullName: string;
    password: string;
    phone?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class CreateUserByAdminDto {
    email: string;
    fullName: string;
    password: string;
    role: UserRole;
    phone?: string;
}
export declare class UserResponseDto {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
    isActive: boolean;
    phone?: string;
    createdAt: Date;
}
export declare class AuthResponseDto {
    access_token: string;
    user: UserResponseDto;
}
