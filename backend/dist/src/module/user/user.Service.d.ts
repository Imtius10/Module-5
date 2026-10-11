import { ILoggedIn, IRegister } from "./user.interface";
declare const userRegisterDB: (payload: IRegister) => Promise<{
    id: string;
    name: string;
    email: string;
    role: import("../../../generated/prisma/enums").UserRole;
    activeStatus: import("../../../generated/prisma/enums").UserStatus;
    createdAt: Date;
    updatedAt: Date;
} | null>;
declare const LoginUserDB: (payload: ILoggedIn) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
declare const getMyProfile: (userId: string) => Promise<{
    id: string;
    name: string;
    email: string;
    role: import("../../../generated/prisma/enums").UserRole;
    activeStatus: import("../../../generated/prisma/enums").UserStatus;
    createdAt: Date;
    updatedAt: Date;
}>;
declare const refreshToken: (refreshTokenValue: string) => Promise<{
    accessToken: string;
}>;
export declare const userService: {
    userRegisterDB: typeof userRegisterDB;
    LoginUserDB: typeof LoginUserDB;
    getMyProfile: typeof getMyProfile;
    refreshToken: typeof refreshToken;
};
export {};
//# sourceMappingURL=user.Service.d.ts.map