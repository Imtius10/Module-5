import { RentalStatus } from "../../../generated/prisma/client";
declare const getMyRentalRequests: (landlordId: string, page?: number, limit?: number) => Promise<{
    data: ({
        property: {
            category: string;
            description: string;
            id: string;
            location: string;
            price: number;
            title: string;
        };
        tenant: {
            activeStatus: import("../../../generated/prisma/enums").UserStatus;
            email: string;
            id: string;
            name: string;
        };
    } & {
        id: string;
        propertyId: string;
        tenantId: string;
        message: string | null;
        status: RentalStatus;
        createdAt: Date;
        updatedAt: Date;
    })[];
    meta: {
        page: number;
        limit: number;
        total: number;
    };
}>;
declare const updateRentalRequestStatus: (requestId: string, landlordId: string, status: RentalStatus) => Promise<{
    property: {
        category: string;
        id: string;
        location: string;
        price: number;
        title: string;
    };
    tenant: {
        email: string;
        id: string;
        name: string;
    };
} & {
    id: string;
    propertyId: string;
    tenantId: string;
    message: string | null;
    status: RentalStatus;
    createdAt: Date;
    updatedAt: Date;
}>;
declare const getMyProperties: (landlordId: string, page?: number, limit?: number) => Promise<{
    data: ({
        rentalRequests: {
            createdAt: Date;
            id: string;
            message: string | null;
            status: RentalStatus;
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
declare const getPropertyRequests: (propertyId: string, landlordId: string) => Promise<({
    tenant: {
        activeStatus: import("../../../generated/prisma/enums").UserStatus;
        email: string;
        id: string;
        name: string;
    };
} & {
    id: string;
    propertyId: string;
    tenantId: string;
    message: string | null;
    status: RentalStatus;
    createdAt: Date;
    updatedAt: Date;
})[]>;
export declare const landlordService: {
    getMyRentalRequests: typeof getMyRentalRequests;
    updateRentalRequestStatus: typeof updateRentalRequestStatus;
    getMyProperties: typeof getMyProperties;
    getPropertyRequests: typeof getPropertyRequests;
};
export {};
//# sourceMappingURL=landlord.Service.d.ts.map