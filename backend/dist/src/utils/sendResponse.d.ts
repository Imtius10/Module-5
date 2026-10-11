import { Response } from "express";
type TMeta = {
    page: number;
    limit: number;
    total: number;
};
type TResponse<T> = {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
    meta?: TMeta;
    errorDetails?: unknown;
};
export declare const sendResponse: <T>(res: Response, data: TResponse<T>) => void;
export {};
//# sourceMappingURL=sendResponse.d.ts.map