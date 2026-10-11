import { UserStatus, UserRole } from "../../../generated/prisma/client";
declare const getAllUsers: (page?: number, limit?: number) => Promise<{
    data: {
        activeStatus: UserStatus;
        createdAt: Date;
        email: string;
        id: string;
        name: string;
        role: UserRole;
        updatedAt: Date;
    }[];
    meta: {
        page: number;
        limit: number;
        total: number;
    };
}>;
declare const updateUserStatus: (userId: string, status: UserStatus) => Promise<{
    activeStatus: UserStatus;
    createdAt: Date;
    email: string;
    id: string;
    name: string;
    role: UserRole;
    updatedAt: Date;
}>;
declare const updateUserRole: (userId: string, role: UserRole) => Promise<{
    activeStatus: UserStatus;
    createdAt: Date;
    email: string;
    id: string;
    name: string;
    role: UserRole;
    updatedAt: Date;
}>;
declare const getAllProperties: (page?: number, limit?: number) => Promise<{
    data: ({
        landlord: {
            activeStatus: UserStatus;
            email: string;
            id: string;
            name: string;
        };
        rentalRequests: {
            createdAt: Date;
            id: string;
            status: import("../../../generated/prisma/enums").RentalStatus;
            tenant: {
                email: string;
                id: string;
                name: string;
            };
        }[];
    } & {
        id: string;
        title: string;
        description: string;
        price: number;
        location: string;
        category: string;
        imageUrl: string | null;
        isAvailable: boolean;
        landlordId: string;
        createdAt: Date;
        updatedAt: Date;
    })[];
    meta: {
        page: number;
        limit: number;
        total: number;
    };
}>;
declare const deleteProperty: (propertyId: string) => Promise<null>;
declare const getAllRentalRequests: (page?: number, limit?: number) => Promise<{
    data: ({
        property: {
            category: string;
            id: string;
            landlord: {
                email: string;
                id: string;
                name: string;
            };
            location: string;
            price: number;
            title: string;
        };
        tenant: {
            activeStatus: UserStatus;
            email: string;
            id: string;
            name: string;
        };
    } & {
        id: string;
        propertyId: string;
        tenantId: string;
        message: string | null;
        status: import("../../../generated/prisma/enums").RentalStatus;
        createdAt: Date;
        updatedAt: Date;
    })[];
    meta: {
        page: number;
        limit: number;
        total: number;
    };
}>;
declare const getStatistics: () => Promise<{
    users: {
        total: number;
        landlords: number;
        tenants: number;
    };
    properties: {
        total: number;
    };
    rentalRequests: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
    };
}>;
export declare const adminService: {
    getAllUsers: typeof getAllUsers;
    updateUserStatus: typeof updateUserStatus;
    updateUserRole: typeof updateUserRole;
    getAllProperties: typeof getAllProperties;
    deleteProperty: typeof deleteProperty;
    getAllRentalRequests: typeof getAllRentalRequests;
    getStatistics: typeof getStatistics;
};
export {};
//# sourceMappingURL=admin.Service.d.ts.map