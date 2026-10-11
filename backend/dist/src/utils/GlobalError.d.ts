declare class GlobalError extends Error {
    statusCode: number;
    errorDetails: unknown;
    constructor(statusCode: number, message: string, errorDetails?: unknown);
}
export default GlobalError;
//# sourceMappingURL=GlobalError.d.ts.map