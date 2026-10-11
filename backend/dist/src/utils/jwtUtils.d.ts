import { JwtPayload } from "jsonwebtoken";
type TokenType = "access" | "refresh";
export declare const createToken: (payload: object, type: TokenType) => string;
export declare const verifyToken: (token: string, type: TokenType) => {
    success: true;
    data: string | JwtPayload;
} | {
    success: false;
    error: string;
};
export {};
//# sourceMappingURL=jwtUtils.d.ts.map