export declare const RentalStatus: {
    readonly PENDING: 'PENDING';
    readonly APPROVED: 'APPROVED';
    readonly REJECTED: 'REJECTED';
};
export type RentalStatus = (typeof RentalStatus)[keyof typeof RentalStatus];
export declare const UserStatus: {
    readonly ACTIVE: 'ACTIVE';
    readonly BLOCKED: 'BLOCKED';
};
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
export declare const UserRole: {
    readonly TENANT: 'TENANT';
    readonly LANDLORD: 'LANDLORD';
    readonly ADMIN: 'ADMIN';
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export declare const PaymentStatus: {
    readonly PENDING: 'PENDING';
    readonly PAID: 'PAID';
    readonly FAILED: 'FAILED';
    readonly CANCELLED: 'CANCELLED';
};
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
//# sourceMappingURL=enums.d.ts.map