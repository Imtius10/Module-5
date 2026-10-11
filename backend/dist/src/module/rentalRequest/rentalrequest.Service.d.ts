import { CreateRentalRequestData } from "./rentalrequest.interface";
declare const createRentalRequest: (data: CreateRentalRequestData) => Promise<{
    property: {
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
}>;
declare const getMyRentalRequests: (tenantId: string, page?: number, limit?: number) => Promise<{
    data: ({
        property: {
            description: string;
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
declare const getRentalRequestById: (requestId: string, tenantId: string) => Promise<{
    property: {
        landlord: {
            email: string;
            id: string;
            name: string;
        };
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
    status: import("../../../generated/prisma/enums").RentalStatus;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare const rentalRequestService: {
    createRentalRequest: typeof createRentalRequest;
    getMyRentalRequests: typeof getMyRentalRequests;
    getRentalRequestById: typeof getRentalRequestById;
};
export {};
//# sourceMappingURL=rentalrequest.Service.d.ts.map