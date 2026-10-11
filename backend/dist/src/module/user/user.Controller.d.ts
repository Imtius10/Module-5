import { NextFunction, Request, Response } from "express";
export declare const userController: {
    userRegister: (req: Request, res: Response, next: NextFunction) => void;
    userLogin: (req: Request, res: Response, next: NextFunction) => void;
    getMyProfile: (req: Request, res: Response, next: NextFunction) => void;
    refreshToken: (req: Request, res: Response, next: NextFunction) => void;
    logout: (req: Request, res: Response, next: NextFunction) => void;
};
//# sourceMappingURL=user.Controller.d.ts.map