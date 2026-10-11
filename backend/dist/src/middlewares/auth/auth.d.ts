import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../../generated/prisma/client";
declare global {
    namespace Express {
        interface Request {
            user?: {
                name: string;
                email: string;
                id: string;
                role: UserRole;
            };
        }
    }
}
export declare const auth: (...requiredRoles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map