import { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { axiosInstance } from "../lib/http";
import toast from "react-hot-toast";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const { user, fetchProfile } = useAuth();

    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [loadingSessions, setLoadingSessions] = useState(false);
    const [sessions, setSessions] = useState([]);

    // ================================
    // 🔹 UPDATE PROFILE
    // ================================
    const updateProfile = async (profileData) => {
        setUpdatingProfile(true);

        try {
            const { data } = await axiosInstance.patch(
                "/user/update-profile",
                profileData
            );

            const updatedUser = data?.data; // ✅ FIXED (no .user)

            // 🔥 sync auth context
            await fetchProfile();

            toast.success(
                data?.message || "Profile updated successfully"
            );

            return updatedUser;
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Failed to update profile";
            toast.error(msg);
            throw err;
        } finally {
            setUpdatingProfile(false);
        }
    };

    // ================================
    // 🔹 GET SESSIONS
    // ================================
    const getUserSessions = useCallback(async () => {
        setLoadingSessions(true);

        try {
            const { data } = await axiosInstance.get("/user/sessions");
            // console.log("Sessions response:", data); // DEBUG

            const sessionsData = data?.data || []; 

            setSessions(sessionsData);

            return sessionsData;
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Failed to fetch sessions";
            toast.error(msg);
            throw err;
        } finally {
            setLoadingSessions(false);
        }
    }, []);

    // ================================
    // 🔹 LOGOUT SPECIFIC SESSION
    // ================================
    const logoutSession = async (sessionId) => {
        try {
            const { data } = await axiosInstance.post(
                `/user/sessions/logout/${sessionId}`
            );

            toast.success(
                data?.message || "Session terminated successfully"
            );

            // 🔥 refresh sessions
            await getUserSessions();
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Failed to terminate session";
            toast.error(msg);
            throw err;
        }
    };

    // ================================
    // 🔹 VALUE
    // ================================
    const value = {
        user, // from AuthContext

        // Profile
        updatingProfile,
        updateProfile,

        // Sessions
        sessions,
        loadingSessions,
        getUserSessions,
        logoutSession,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

// ================================
// 🔹 HOOK
// ================================
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within UserProvider");
    }
    return context;
};