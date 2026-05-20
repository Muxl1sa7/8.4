export declare enum UserRole {
    SUPERADMIN = "superadmin",
    ADMIN = "admin",
    WORKER = "worker",
    CUSTOMER = "customer"
}
export declare class User {
    id: string;
    email: string;
    fullName: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
}
