import catchAsync from "../../utils/catchAsync";
import { userService } from "./user.Service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status';
const isProd = process.env.NODE_ENV === "production";
const cookieOptions = (maxAge) => ({
    httpOnly: true,
    // Cross-site (frontend on Vercel, API on another domain) requires
    // SameSite=None + Secure in production; localhost uses Lax.
    sameSite: (isProd ? "none" : "lax"),
    secure: isProd,
    maxAge,
});
const userRegister = catchAsync(async (req, res, next) => {
    const result = await userService.userRegisterDB(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Register Success",
        data: result
    });
});
const userLogin = catchAsync(async (req, res, next) => {
    const result = await userService.LoginUserDB(req.body);
    res.cookie("accessToken", result.accessToken, cookieOptions(15 * 60 * 1000));
    // Refresh token cookie
    res.cookie("refreshToken", result.refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Login in success",
        data: result
    });
});
const getMyProfile = catchAsync(async (req, res, next) => {
    const userId = req.user?.id;
    const result = await userService.getMyProfile(userId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Profile retrieved successfully",
        data: result,
    });
});
const refreshToken = catchAsync(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : undefined;
    const token = tokenFromHeader || req.cookies.refreshToken;
    if (!token) {
        throw new Error("Refresh token not found");
    }
    const result = await userService.refreshToken(token);
    res.cookie("accessToken", result.accessToken, cookieOptions(15 * 60 * 1000));
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Access token refreshed successfully",
        data: result,
    });
});
const logout = catchAsync(async (req, res, next) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Logged out successfully",
        data: null,
    });
});
export const userController = {
    userRegister,
    userLogin,
    getMyProfile,
    refreshToken,
    logout
};
//# sourceMappingURL=user.Controller.js.map