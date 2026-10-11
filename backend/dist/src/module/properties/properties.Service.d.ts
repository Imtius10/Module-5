import { CreatePropertyData, PropertyQuery, UpdatePropertyData } from "./properties.interface";
declare const createProperty: (data: CreatePropertyData) => Promise<{
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
}>;
declare const getAllProperties: (query: PropertyQuery) => Promise<{
    data: ({
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
    })[];
    meta: {
        page: number;
        limit: number;
        total: number;
    };
}>;
declare const getPropertyById: (propertyId: string) => Promise<{
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
}>;
declare const updateProperty: (id: string, landlordId: string, data: UpdatePropertyData) => Promise<{
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
}>;
declare const deleteProperty: (id: string, landlordId: string) => Promise<null>;
declare const getCategories: () => Promise<string[]>;
export declare const propertyService: {
    createProperty: typeof createProperty;
    getAllProperties: typeof getAllProperties;
    getPropertyById: typeof getPropertyById;
    updateProperty: typeof updateProperty;
    deleteProperty: typeof deleteProperty;
    getCategories: typeof getCategories;
};
export {};
//# sourceMappingURL=properties.Service.d.ts.map