export const sendResponse = (res, data) => {
    res.status(data.statusCode).json({
        success: data.success,
        statusCode: data.statusCode,
        message: data.message,
        data: data.data,
        ...(data.meta && { meta: data.meta }),
        ...(data.errorDetails !== undefined ? {
            errorDetails: data.errorDetails,
        } : {}),
    });
};
//# sourceMappingURL=sendResponse.js.map