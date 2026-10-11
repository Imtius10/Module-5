interface CreateReviewData {
    rentalRequestId: string;
    tenantId: string;
    rating: number;
    comment?: string;
}
declare const createReview: (data: CreateReviewData) => Promise<{
    property: {
        id: string;
        location: string;
        title: string;
    };
    tenant: {
        id: string;
        name: string;
    };
} & {
    id: string;
    rentalRequestId: string;
    propertyId: string;
    tenantId: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    updatedAt: Date;
}>;
declare const getPropertyReviews: (propertyId: string, page?: number, limit?: number) => Promise<{
    data: ({
        tenant: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        rentalRequestId: string;
        propertyId: string;
        tenantId: string;
        rating: number;
        comment: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[];
    meta: {
        page: number;
        limit: number;
        total: number;
    };
}>;
export declare const reviewService: {
    createReview: typeof createReview;
    getPropertyReviews: typeof getPropertyReviews;
};
export {};
//# sourceMappingURL=review.Service.d.ts.map