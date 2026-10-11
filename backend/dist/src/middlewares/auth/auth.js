import { UserStatus } from "../../../generated/prisma/client";
import catchAsync from "../../utils/catchAsync";
import { verifyToken } from "../../utils/jwtUtils";
import { prisma } from "../../lib/prisma";
export const auth = (...requiredRoles) => {
    return catchAsync(async (req, res, next) => {
        // Get token from cookie or Authorization header
        const token = req.cookies.accessToken
            ? req.cookies.accessToken
            : req.headers.authorization?.startsWith("Bearer ")
                ? req.headers.authorization.split(" ")[1]
                : req.headers.authorization;
        if (!token) {
            throw new Error("You are not logged in");
        }
        // Verify access token
        const verifiedToken = verifyToken(token, "access");
        if (!verifiedToken.success) {
            throw new Error(verifiedToken.error);
        }
        // Get user information from JWT
        const { email, name, id, role } = verifiedToken.data;
        // Check role permission
        if (requiredRoles.length > 0 &&
            !requiredRoles.includes(role)) {
            throw new Error("Forbidden role");
        }
        // Check if user still exists
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        // Check if database role matches JWT role
        if (user.role !== role) {
            throw new Error("Role mismatch");
        }
        // Check account status
        if (user.activeStatus === UserStatus.BLOCKED) {
            throw new Error("Your account has been blocked");
        }
        // Attach authenticated user to request
        req.user = {
            name: user.name,
            email: user.email,
            id: user.id,
            role: user.role,
        };
        next();
    });
};
//# sourceMappingURL=auth.js.map