import { prisma } from "../../lib/prisma";
const createRentalRequest = async (data) => {
    // Check property exists
    const property = await prisma.property.findUnique({
        where: {
            id: data.propertyId,
        },
    });
    if (!property) {
        throw new Error("Property not found");
    }
    // Check if tenant already requested this property
    const existingRequest = await prisma.rentalRequest.findFirst({
        where: {
            propertyId: data.propertyId,
            tenantId: data.tenantId,
        },
    });
    if (existingRequest) {
        throw new Error("You have already requested this property");
    }
    const rentalRequest = await prisma.rentalRequest.create({
        data: {
            propertyId: data.propertyId,
            tenantId: data.tenantId,
            message: data.message,
        },
        include: {
            property: {
                select: {
                    id: true,
                    title: true,
                    price: true,
                    location: true,
                    landlord: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
            tenant: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
    return rentalRequest;
};
const getMyRentalRequests = async (tenantId, page = 1, limit = 10) => {
    const pageNum = Math.max(1, page);
    const limitNum = Math.min(50, Math.max(1, limit));
    const skip = (pageNum - 1) * limitNum;
    const [data, total] = await Promise.all([
        prisma.rentalRequest.findMany({
            where: {
                tenantId,
            },
            include: {
                property: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        price: true,
                        location: true,
                        landlord: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: limitNum,
        }),
        prisma.rentalRequest.count({
            where: { tenantId },
        }),
    ]);
    return {
        data,
        meta: {
            page: pageNum,
            limit: limitNum,
            total,
        },
    };
};
const getRentalRequestById = async (requestId, tenantId) => {
    const request = await prisma.rentalRequest.findUnique({
        where: {
            id: requestId,
        },
        include: {
            property: {
                include: {
                    landlord: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
            tenant: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });
    if (!request) {
        throw new Error("Rental request not found");
    }
    if (request.tenantId !== tenantId) {
        throw new Error("You are not allowed to view this rental request");
    }
    return request;
};
export const rentalRequestService = {
    createRentalRequest,
    getMyRentalRequests,
    getRentalRequestById,
};
//# sourceMappingURL=rentalrequest.Service.js.map