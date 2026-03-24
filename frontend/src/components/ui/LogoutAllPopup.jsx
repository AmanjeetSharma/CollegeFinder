// components/ui/LogoutAllPopup.jsx
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, LogOut, X } from "lucide-react";

const LogoutAllPopup = ({ isOpen, onClose, onConfirm, sessionCount }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md"
                >
                    <Card className="border-0 shadow-2xl">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 rounded-full">
                                        <AlertTriangle className="h-5 w-5 text-red-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Logout All Devices
                                    </h3>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <p className="text-gray-600 mb-2">
                                Are you sure you want to logout from all other devices?
                            </p>

                            {sessionCount > 1 && (
                                <div className="text-sm text-gray-600 mb-6 space-y-2">
                                    <p className="flex items-start gap-2">
                                        <span>🔒</span>
                                        <span>This will sign you out from all other devices where your account is active.</span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <span>✅</span>
                                        <span>Your current session on this device will remain active.</span>
                                    </p>
                                </div>
                            )}

                            {sessionCount === 1 && (
                                <p className="text-sm text-gray-500 mb-6">
                                    You are currently logged in on this device only.
                                    Logging out will keep your current session active.
                                </p>
                            )}

                            <div className="flex gap-3 mt-6">
                                <Button
                                    variant="outline"
                                    onClick={onClose}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={onConfirm}
                                    variant="destructive"
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout Others
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LogoutAllPopup;