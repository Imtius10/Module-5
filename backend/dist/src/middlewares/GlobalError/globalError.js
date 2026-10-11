import httpStatus from "http-status";
import GlobalError from "../../utils/GlobalError.js";
const globalError = (err, _req, res, _next) => {
    let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    let message = "Something went wrong";
    let errorDetails = null;
    if (err instanceof GlobalError) {
        statusCode = err.statusCode;
        message = err.message;
        errorDetails = err.errorDetails;
    }
    else if (err instanceof Error) {
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errorDetails,
    });
};
export default globalError;
//# sourceMappingURL=globalError.js.map