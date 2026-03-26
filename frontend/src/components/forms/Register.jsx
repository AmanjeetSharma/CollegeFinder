// pages/ChangePasswordPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePassword } from "../../context/PasswordContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Loader2,
    Eye,
    EyeOff,
    Lock,
    CheckCircle2,
    LogOut,
    ArrowLeft,
    Shield,
    KeyRound,
    XCircle
} from "lucide-react";

const ChangePasswordPage = () => {
    const { clearSession } = useAuth();
    const { changePassword, loading: passwordLoading } = usePassword();
    const navigate = useNavigate();

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [logoutCountdown, setLogoutCountdown] = useState(5);
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        message: ""
    });

    // Password strength checker
    const checkPasswordStrength = (password) => {
        let score = 0;
        let message = "";

        if (!password) {
            return { score: 0, message: "" };
        }

        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 2) message = "Very Weak";
        else if (score <= 3) message = "Weak";
        else if (score <= 4) message = "Medium";
        else if (score <= 5) message = "Strong";
        else message = "Very Strong";

        return { score, message };
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }

        // Check password strength for new password
        if (name === "newPassword") {
            setPasswordStrength(checkPasswordStrength(value));
        }
    };

    // Password validation with strict requirements
    const validatePasswordForm = () => {
        const newErrors = {};

        if (!passwordForm.currentPassword) {
            newErrors.currentPassword = "Current password is required";
        }

        if (!passwordForm.newPassword) {
            newErrors.newPassword = "Password is required";
        } else {
            if (passwordForm.newPassword.length < 8) {
                newErrors.newPassword = "Password must be at least 8 characters";
            } else if (!/[A-Z]/.test(passwordForm.newPassword)) {
                newErrors.newPassword = "Password must contain at least one uppercase letter";
            } else if (!/[a-z]/.test(passwordForm.newPassword)) {
                newErrors.newPassword = "Password must contain at least one lowercase letter";
            } else if (!/[0-9]/.test(passwordForm.newPassword)) {
                newErrors.newPassword = "Password must contain at least one number";
            } else if (!/[^A-Za-z0-9]/.test(passwordForm.newPassword)) {
                newErrors.newPassword = "Password must contain at least one special character (e.g., !@#$%^&*)";
            }
        }

        if (!passwordForm.confirmNewPassword) {
            newErrors.confirmNewPassword = "Please confirm your new password";
        } else if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
            newErrors.confirmNewPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!validatePasswordForm()) {
            return;
        }

        setLoading(true);

        try {
            await changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
                confirmNewPassword: passwordForm.confirmNewPassword
            });

            // Reset form
            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: ""
            });
            setErrors({});

            // Show success dialog
            setShowSuccessDialog(true);
            setLogoutCountdown(5);

        } catch (error) {
            // Error handled in context
            setLoading(false);
        }
    };

    // Handle countdown and redirect after successful password change
    useEffect(() => {
        let timer;
        let redirectTimeout;

        if (showSuccessDialog) {
            timer = setInterval(() => {
                setLogoutCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            redirectTimeout = setTimeout(() => {
                clearSession();
                navigate("/login");
            }, 5500);
        }

        return () => {
            if (timer) clearInterval(timer);
            if (redirectTimeout) clearTimeout(redirectTimeout);
        };
    }, [showSuccessDialog, clearSession, navigate]);

    const handleBack = () => {
        navigate(-1);
    };

    // Get password strength color
    const getPasswordStrengthColor = () => {
        if (passwordStrength.score <= 2) return "bg-red-500";
        if (passwordStrength.score <= 3) return "bg-orange-500";
        if (passwordStrength.score <= 4) return "bg-yellow-500";
        if (passwordStrength.score <= 5) return "bg-blue-500";
        return "bg-green-500";
    };

    // Get password strength width
    const getPasswordStrengthWidth = () => {
        if (!passwordForm.newPassword) return "0%";
        const percentage = (passwordStrength.score / 6) * 100;
        return `${percentage}%`;
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-between p-4 pt-16 bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Back to Profile Link - Top Left */}
            <div className="absolute top-4 left-4 z-10">
                <Link
                    to="/profile"
                    className="inline-flex items-center gap-2 px-3 py-2 font-semibold text-sm text-gray-900 hover:text-stone-800 transition-colors group bg-white/50 hover:bg-gray-200 rounded-lg backdrop-blur-sm"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                    Back to Profile
                </Link>
            </div>

            <div className="w-full max-w-md flex-1 flex items-center">
                <Card className="border shadow-2xl shadow-black/5 w-full relative overflow-hidden">
                    {/* Premium accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-stone-600 to-amber-500" />

                    <CardHeader className="text-center space-y-2 pt-8 pb-4">
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
                            Change Password
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Secure your account with a strong password
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleChangePassword}>
                        <CardContent className="space-y-5 px-6 pb-2">
                            {/* Current Password */}
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword" className="text-stone-700">
                                    Current Password <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                    <Input
                                        id="currentPassword"
                                        name="currentPassword"
                                        type={showCurrentPassword ? "text" : "password"}
                                        placeholder="Enter current password"
                                        value={passwordForm.currentPassword}
                                        onChange={handleChange}
                                        className={`pl-9 pr-9 ${errors.currentPassword ? "border-destructive focus-visible:ring-destructive" : "border-stone-200 focus:border-stone-400"} transition-all`}
                                        disabled={loading}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.currentPassword && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <XCircle className="h-3 w-3" />
                                        {errors.currentPassword}
                                    </p>
                                )}
                            </div>

                            {/* New Password */}
                            <div className="space-y-2">
                                <Label htmlFor="newPassword" className="text-stone-700">
                                    New Password <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                    <Input
                                        id="newPassword"
                                        name="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="Enter new password"
                                        value={passwordForm.newPassword}
                                        onChange={handleChange}
                                        className={`pl-9 pr-9 ${errors.newPassword ? "border-destructive focus-visible:ring-destructive" : "border-stone-200 focus:border-stone-400"} transition-all`}
                                        disabled={loading}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>

                                {/* Password Requirements */}
                                {passwordForm.newPassword && (
                                    <div className="space-y-2 mt-2">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-muted-foreground">Password strength:</span>
                                            <span className={`font-medium ${
                                                passwordStrength.score <= 2 ? "text-red-500" :
                                                passwordStrength.score <= 3 ? "text-orange-500" :
                                                passwordStrength.score <= 4 ? "text-yellow-500" :
                                                passwordStrength.score <= 5 ? "text-blue-500" :
                                                "text-green-500"
                                            }`}>
                                                {passwordStrength.message}
                                            </span>
                                        </div>
                                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                                style={{ width: getPasswordStrengthWidth() }}
                                            />
                                        </div>
                                        <ul className="text-xs space-y-1 mt-2">
                                            <li className={`flex items-center gap-1 ${passwordForm.newPassword.length >= 8 ? "text-green-500" : "text-muted-foreground"}`}>
                                                {passwordForm.newPassword.length >= 8 ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                <span>At least 8 characters</span>
                                            </li>
                                            <li className={`flex items-center gap-1 ${/[A-Z]/.test(passwordForm.newPassword) ? "text-green-500" : "text-muted-foreground"}`}>
                                                {/[A-Z]/.test(passwordForm.newPassword) ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                <span>At least one uppercase letter</span>
                                            </li>
                                            <li className={`flex items-center gap-1 ${/[a-z]/.test(passwordForm.newPassword) ? "text-green-500" : "text-muted-foreground"}`}>
                                                {/[a-z]/.test(passwordForm.newPassword) ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                <span>At least one lowercase letter</span>
                                            </li>
                                            <li className={`flex items-center gap-1 ${/[0-9]/.test(passwordForm.newPassword) ? "text-green-500" : "text-muted-foreground"}`}>
                                                {/[0-9]/.test(passwordForm.newPassword) ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                <span>At least one number</span>
                                            </li>
                                            <li className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(passwordForm.newPassword) ? "text-green-500" : "text-muted-foreground"}`}>
                                                {/[^A-Za-z0-9]/.test(passwordForm.newPassword) ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                <span>At least one special character (e.g., !@#$%^&*)</span>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                                {errors.newPassword && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <XCircle className="h-3 w-3" />
                                        {errors.newPassword}
                                    </p>
                                )}
                            </div>

                            {/* Confirm New Password */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmNewPassword" className="text-stone-700">
                                    Confirm New Password <span className="text-destructive">*</span>
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                    <Input
                                        id="confirmNewPassword"
                                        name="confirmNewPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm new password"
                                        value={passwordForm.confirmNewPassword}
                                        onChange={handleChange}
                                        className={`pl-9 pr-9 ${errors.confirmNewPassword ? "border-destructive focus-visible:ring-destructive" : "border-stone-200 focus:border-stone-400"} transition-all`}
                                        disabled={loading}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.confirmNewPassword && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <XCircle className="h-3 w-3" />
                                        {errors.confirmNewPassword}
                                    </p>
                                )}
                                {passwordForm.confirmNewPassword && passwordForm.newPassword === passwordForm.confirmNewPassword && passwordForm.newPassword && (
                                    <p className="text-xs text-green-600 flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Passwords match
                                    </p>
                                )}
                            </div>

                            {/* Security note */}
                            <div className="bg-gradient-to-br from-stone-50 to-white rounded-lg p-3 border border-stone-200/60">
                                <div className="flex items-center gap-2 text-xs text-stone-500">
                                    <Shield className="h-3 w-3" />
                                    <span>Use a strong, unique password to keep your account secure</span>
                                </div>
                            </div>
                        </CardContent>

                        <div className="px-6 pb-8 pt-4">
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleBack}
                                    className="flex-1 border-stone-200 hover:bg-stone-50"
                                    disabled={loading}
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-stone-800 hover:bg-stone-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                                >
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {loading ? "Changing Password..." : "Change Password"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </Card>
            </div>

            {/* Footer */}
            <footer className="w-full py-6 text-center border-t mt-8">
                <div className="container mx-auto px-4">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} CollegeFinder. All rights reserved.
                    </p>
                    <div className="flex justify-center gap-4 mt-2">
                        <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                            Terms of Service
                        </Link>
                        <span className="text-muted-foreground text-xs">•</span>
                        <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                            Privacy Policy
                        </Link>
                        <span className="text-muted-foreground text-xs">•</span>
                        <Link to="/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </footer>

            {/* Success Alert Dialog */}
            <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <AlertDialogContent className="sm:max-w-md text-center flex flex-col items-center">
                    <AlertDialogHeader className="items-center text-center">
                        <div className="flex items-center justify-center mb-2">
                            <CheckCircle2 className="h-12 w-12 text-green-500" />
                        </div>
                        <AlertDialogTitle className="text-xl font-semibold">
                            Password Changed Successfully!
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2 w-full">
                            <div>Your password has been updated successfully.</div>
                            <div className="flex items-center justify-center gap-2 text-sm font-medium text-stone-700">
                                <LogOut className="h-4 w-4" />
                                Logging out in {logoutCountdown} seconds...
                            </div>
                            <div className="text-xs text-stone-500">
                                You'll need to log in again with your new password.
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ChangePasswordPage;