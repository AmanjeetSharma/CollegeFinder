import { createContext, useContext, useState } from "react";
import { axiosInstance } from "../lib/http";
import { shadcnToast } from "../components/shadcnToast/ToastConfig.jsx";
import { IoIosMail } from "react-icons/io";

const PasswordContext = createContext(null);

export const PasswordProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);









    // CHANGE PASSWORD (AUTH REQUIRED)
    const changePassword = async ({ currentPassword, newPassword, confirmNewPassword, }) => {
        setLoading(true);

        try {
            const { data } = await axiosInstance.post("/password/change-password", {
                currentPassword, newPassword, confirmNewPassword,
            });

            shadcnToast.success(
                data?.message ||
                "Password changed successfully. Please login again.",
                {
                    duration: 4000,
                    position: "top-center",
                    description: "You will be redirected to login",
                }
            );

            return true;
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Failed to change password";
            shadcnToast.error(msg, {
                duration: 4000,
                position: "top-center",
                description: "Please check your current password and try again",
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };









    // FORGOT PASSWORD
    const forgotPassword = async (email) => {
        setLoading(true);

        try {
            const { data } = await axiosInstance.post("/password/forgot-password", { email });

            shadcnToast.info(  // Using info toast since we don't want to imply success if the email doesn't exist
                data?.message ||
                "If this email exists, a reset link has been sent",
                {
                    duration: 8000,
                    position: "top-center",
                    description: "Please check your inbox or spam folder",
                    icon: <IoIosMail size={20} />,
                }
            );

            return true;
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Something went wrong";
            shadcnToast.error(msg, {
                duration: 4000,
                position: "top-center",
                description: "Please try again or contact support",
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };









    // RESET PASSWORD
    const resetPassword = async ({ token, newPassword, confirmNewPassword, }) => {
        setLoading(true);

        try {
            const { data } = await axiosInstance.post("/password/reset-password", {
                token, newPassword, confirmNewPassword,
            });

            shadcnToast.success(
                data?.message ||
                "Password reset successful. Please login.",
                {
                    duration: 4000,
                    position: "top-center",
                    description: "You can now login with your new password",
                }
            );

            return true;
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Password reset failed";
            shadcnToast.error(msg, {
                duration: 4000,
                position: "top-center",
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };









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


export const usePassword = () => {
    const context = useContext(PasswordContext);
    if (!context) {
        throw new Error(
            "usePassword must be used within PasswordProvider"
        );
    }
    return context;
};