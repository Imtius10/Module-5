import Stripe from "stripe";
import { PaymentStatus, RentalStatus } from "../../../generated/prisma/client";
declare const createPayment: (rentalRequestId: string, tenantId: string) => Promise<{
    payment: {
        id: string;
        rentalRequestId: string;
        tenantId: string;
        amount: number;
        transactionId: string | null;
        status: PaymentStatus;
        createdAt: Date;
        updatedAt: Date;
    };
    checkoutUrl: string | null;
    sessionId: string;
}>;
declare const getMyPayments: (tenantId: string, page?: number, limit?: number) => Promise<{
    data: ({
        rentalRequest: {
            property: {
                id: string;
                location: string;
                price: number;
                title: string;
            };
        } & {
            id: string;
            propertyId: string;
            tenantId: string;
            message: string | null;
            status: RentalStatus;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        rentalRequestId: string;
        tenantId: string;
        amount: number;
        transactionId: string | null;
        status: PaymentStatus;
        createdAt: Date;
        updatedAt: Date;
    })[];
    meta: {
        page: number;
        limit: number;
        total: number;
    };
}>;
declare const getPaymentById: (paymentId: string, tenantId: string) => Promise<{
    rentalRequest: {
        property: {
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
    } & {
        id: string;
        propertyId: string;
        tenantId: string;
        message: string | null;
        status: RentalStatus;
        createdAt: Date;
        updatedAt: Date;
    };
} & {
    id: string;
    rentalRequestId: string;
    tenantId: string;
    amount: number;
    transactionId: string | null;
    status: PaymentStatus;
    createdAt: Date;
    updatedAt: Date;
}>;
declare const handleStripeWebhook: (event: Stripe.Event) => Promise<void>;
/**
 * DEV: Trigger Stripe webhook and save transactionId
 */
declare const testConfirmPayment: (paymentId: string) => Promise<{
    id: string;
    rentalRequestId: string;
    tenantId: string;
    amount: number;
    transactionId: string | null;
    status: PaymentStatus;
    createdAt: Date;
    updatedAt: Date;
}>;
/**
 * Verify a Stripe Checkout session server-side and mark the
 * payment as PAID when Stripe reports it paid. Used by the
 * frontend success page so the UI is correct even before the
 * webhook is delivered.
 */
declare const verifyPayment: (sessionId: string, tenantId: string) => Promise<{
    payment: {
        id: string;
        rentalRequestId: string;
        tenantId: string;
        amount: number;
        transactionId: string | null;
        status: PaymentStatus;
        createdAt: Date;
        updatedAt: Date;
    };
    paid: boolean;
    status: string;
}>;
export declare const paymentService: {
    createPayment: typeof createPayment;
    getMyPayments: typeof getMyPayments;
    getPaymentById: typeof getPaymentById;
    handleStripeWebhook: typeof handleStripeWebhook;
    verifyPayment: typeof verifyPayment;
    testConfirmPayment: typeof testConfirmPayment;
};
export {};
//# sourceMappingURL=payment.Service.d.ts.map