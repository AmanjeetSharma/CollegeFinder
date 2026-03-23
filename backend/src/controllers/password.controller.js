import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const changePassword = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Please log in to change your password");
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword) {
        throw new ApiError(400, "Current password is required");
    }
    if (!newPassword) {
        throw new ApiError(400, "New password is required");
    }
    if (newPassword.length < 8) {
        throw new ApiError(400, "New password must be at least 8 characters long");
    }

    const user = await User.findById(userId).select("+password");

    if (!user) {
        throw new ApiError(404, "User account not found");
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw new ApiError(401, "Current password is incorrect");
    }

    // Prevent same password reuse
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
        throw new ApiError(400, "New password must be different from your current password");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Invalidate all sessions
    if (user.sessions && user.sessions.length > 0) {
        user.sessions = user.sessions.map((s) => ({
            ...s.toObject(),
            isActive: false,
            refreshToken: null
        }));
    }

    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Password changed successfully. All sessions have been logged out.")
        );
});



export {
    changePassword,
};