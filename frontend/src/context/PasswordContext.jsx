import { createContext, useContext, useState } from "react";
import { axiosInstance } from "../lib/http";
import toast from "react-hot-toast";

const PasswordContext = createContext(null);

export const PasswordProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    // ================================
    // 🔹 CHANGE PASSWORD (AUTH REQUIRED)
    // ================================
    const changePassword = async ({
        currentPassword,
        newPassword,
        confirmNewPassword,
    }) => {
        setLoading(true);

        try {
            const { data } = await axiosInstance.post(
                "/password/change-password",
                {
                    currentPassword,
                    newPassword,
                    confirmNewPassword,
                }
            );

            toast.success(
                data?.message ||
                "Password changed successfully. Please login again."
            );

            return true;
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Failed to change password";
            toast.error(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // ================================
    // 🔹 FORGOT PASSWORD
    // ================================
    const forgotPassword = async (email) => {
        setLoading(true);

        try {
            const { data } = await axiosInstance.post(
                "/password/forgot-password",
                { email }
            );

            // ⚠️ Always generic message (security)
            toast.success(
                data?.message ||
                "If this email exists, a reset link has been sent"
            );

            return true;
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Something went wrong";
            toast.error(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // ================================
    // 🔹 RESET PASSWORD
    // ================================
    const resetPassword = async ({
        token,
        newPassword,
        confirmNewPassword,
    }) => {
        setLoading(true);

        try {
            const { data } = await axiosInstance.post(
                "/password/reset-password",
                {
                    token,
                    newPassword,
                    confirmNewPassword,
                }
            );

            toast.success(
                data?.message ||
                "Password reset successful. Please login."
            );

            return true;
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Password reset failed";
            toast.error(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // ================================
    // 🔹 VALUE
    // ================================
    const value = {
        loading,
        changePassword,
        forgotPassword,
        resetPassword,
    };

    return (
        <PasswordContext.Provider value={value}>
            {children}
        </PasswordContext.Provider>
    );
};

// ================================
// 🔹 HOOK
// ================================
export const usePassword = () => {
    const context = useContext(PasswordContext);
    if (!context) {
        throw new Error(
            "usePassword must be used within PasswordProvider"
        );
    }
    return context;
};