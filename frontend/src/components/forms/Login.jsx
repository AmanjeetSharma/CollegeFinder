import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [forgot, setForgot] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [sent, setSent] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            await login(email, password, "web");
            navigate("/dashboard");
        } catch (err) {
            setError(err.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        setError("");

        if (!resetEmail) {
            setError("Enter your email");
            return;
        }

        setLoading(true);
        try {
            await new Promise((r) => setTimeout(r, 800));
            setSent(true);
        } catch (e) {
            setError("Failed to send link");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-between p-4 bg-slate-50">
            <div className="w-full max-w-md flex-1 flex items-center">
                <Card className="border shadow-lg w-full">
                    <CardHeader className="text-center space-y-2 pt-8 pb-4">
                        <CardTitle className="text-3xl font-bold">
                            {forgot ? "Reset Password" : "Welcome Back"}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            {forgot
                                ? "We'll send you a reset link to your email"
                                : "Sign in to access your account"}
                        </CardDescription>
                    </CardHeader>

                    {!forgot ? (
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-5 px-6 pb-2">
                                {error && (
                                    <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                                        <p className="text-sm text-destructive text-center">
                                            {error}
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setError("");
                                                setForgot(true);
                                            }}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-9 pr-9"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                            </CardContent>

                            <div className="px-6 pb-8 pt-4">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={loading}
                                >
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {loading ? "Signing in..." : "Sign In"}
                                </Button>

                                <p className="text-sm text-center text-muted-foreground mt-6">
                                    Don't have an account?{" "}
                                    <Link to="/register" className="text-primary font-semibold hover:underline">
                                        Create account
                                    </Link>
                                </p>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleReset}>
                            <CardContent className="space-y-5 px-6 pb-2">
                                {error && (
                                    <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                                        <p className="text-sm text-destructive text-center">
                                            {error}
                                        </p>
                                    </div>
                                )}

                                {sent ? (
                                    <div className="text-center space-y-4 py-8">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                            <div className="text-green-600 text-2xl">✓</div>
                                        </div>
                                        <div>
                                            <p className="font-medium">Reset link sent!</p>
                                            <p className="text-sm text-muted-foreground mt-1">Check your email at</p>
                                            <p className="font-semibold mt-2 text-foreground">{resetEmail}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Label htmlFor="reset-email">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="reset-email"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={resetEmail}
                                                onChange={(e) => setResetEmail(e.target.value)}
                                                className="pl-9"
                                            />
                                        </div>
                                    </div>
                                )}
                            </CardContent>

                            <div className="px-6 pb-8 pt-4">
                                {!sent && (
                                    <Button
                                        type="submit"
                                        className="w-full mb-3"
                                        disabled={loading}
                                    >
                                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Send Reset Link
                                    </Button>
                                )}

                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        setError("");
                                        setForgot(false);
                                        setSent(false);
                                        setResetEmail("");
                                    }}
                                    className="w-full"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Sign In
                                </Button>
                            </div>
                        </form>
                    )}
                </Card>
            </div>

            {/* Footer - Same as Register component */}
            <footer className="w-full py-6 text-center border-t mt-8">
                <div className="container mx-auto px-4">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
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
        </div>
    );
}