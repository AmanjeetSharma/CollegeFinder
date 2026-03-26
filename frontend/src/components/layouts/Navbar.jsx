// components/layout/Navbar.jsx
import { useState, useEffect, useRef, memo, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, GraduationCap, LayoutDashboard, Settings, Shield, LogOut, ChevronDown, Sparkles } from "lucide-react";

// Optimized nav links with minimal icons
const navLinks = [
    { name: "Explore", path: "/colleges", icon: null },
    { name: "Guide", path: "/how-it-works", icon: null },
];

const infoLinks = [
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "FAQ", path: "/faq" }
];

// Premium Button with Shiny Hover Effect
const PremiumButton = memo(({ children, onClick, href, className = "" }) => {
    const baseClasses = "relative inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-black to-gray-800 text-white shadow-md overflow-hidden group transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]";

    const inner = (
        <button onClick={onClick} className={`${baseClasses} ${className}`}>
            {/* Shiny overlay effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative z-10 flex items-center gap-1.5">
                {children}
            </span>
        </button>
    );

    return href ? <Link to={href}>{inner}</Link> : inner;
});

PremiumButton.displayName = 'PremiumButton';

const GhostButton = memo(({ children, href, onClick, icon: Icon, className = "" }) => {
    const content = (
        <button
            onClick={onClick}
            className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors ${className}`}
        >
            {Icon && <Icon className="h-4 w-4" />}
            {children}
        </button>
    );
    return href ? <Link to={href}>{content}</Link> : content;
});

GhostButton.displayName = 'GhostButton';

const Logo = memo(() => (
    <Link to="/" className="flex items-center gap-2.5 group">
        <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <GraduationCap className="h-5 w-5 text-white" strokeWidth={1.8} />
            </div>
            {/* Animated sparkle effect */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
        </div>
        <div className="flex flex-col leading-tight">
            <span className="text-xl font-black tracking-tight bg-gray-900 bg-clip-text text-transparent"
                style={{ fontFamily: "'Poppins', 'Inter', system-ui, -apple-system, sans-serif", letterSpacing: '-0.02em' }}>
                CollegeFinder
            </span>
            <span className="text-[10px] font-medium text-gray-700 tracking-wide">Your Future Starts Here</span>
        </div>
    </Link>
));

Logo.displayName = 'Logo';

// Helper functions
const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
};

// Simple Desktop Info Links
const DesktopInfoLinks = memo(({ navigate, currentPath }) => (
    <div className="ml-3 border-l border-gray-200 pl-3 flex items-center gap-1">
        {infoLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
                <Button
                    key={link.path}
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(link.path)}
                    className={`px-4 py-2 h-auto transition-colors cursor-pointer ${isActive ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
                >
                    <span className="text-sm font-medium">{link.label}</span>
                </Button>
            );
        })}
    </div>
));

DesktopInfoLinks.displayName = 'DesktopInfoLinks';

// Mobile Info Links
const MobileInfoLinks = memo(({ navigate, onClose, currentPath }) => (
    <div className="grid grid-cols-3 gap-2 p-2">
        {infoLinks.map(({ label, path }) => {
            const isActive = currentPath === path;
            return (
                <Link
                    key={path}
                    to={path}
                    onClick={onClose}
                    className={`flex flex-col items-center gap-2 py-3 px-2 rounded-xl transition-colors ${isActive
                            ? "bg-gray-900 text-white"
                            : "bg-gray-100 hover:bg-gray-100 text-gray-700"
                        }`}
                >
                    <span className="text-xs font-semibold">{label}</span>
                </Link>
            );
        })}
    </div>
));

MobileInfoLinks.displayName = 'MobileInfoLinks';

// Main Navbar Component
const Navbar = () => {
    const { user, isAuthenticated, loading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const mobileMenuRef = useRef(null);

    // Optimized scroll handler
    useEffect(() => {
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setScrolled(window.scrollY > 8);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [currentPath]);

    // Close on outside click
    useEffect(() => {
        if (!mobileOpen) return;

        const handler = (e) => {
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
                setMobileOpen(false);
            }
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [mobileOpen]);

    const handleLogout = useCallback(async () => {
        await logout();
        navigate("/");
        setMobileOpen(false);
    }, [logout, navigate]);

    const isActive = useCallback((path) => currentPath === path, [currentPath]);

    // Loading skeleton
    if (loading) {
        return (
            <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
                    <Logo />
                </div>
            </nav>
        );
    }

    return (
        <>
            {/* Add Poppins font for fun branding */}
            <link
                href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap"
                rel="stylesheet"
            />
            <nav
                className={`sticky top-0 z-50 transition-all duration-200 ${scrolled
                        ? "bg-white/95 border-b border-gray-200 shadow-sm"
                        : "bg-white border-b border-gray-100"
                    }`}
                ref={mobileMenuRef}
                style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Logo />

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-2">
                            {navLinks.map((link) => (
                                <Link key={link.path} to={link.path}>
                                    <div
                                        className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isActive(link.path)
                                                ? "text-gray-900 bg-gray-100"
                                                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                            }`}
                                    >
                                        {link.name}
                                    </div>
                                </Link>
                            ))}

                            <DesktopInfoLinks navigate={navigate} currentPath={currentPath} />
                        </div>

                        {/* Desktop Auth */}
                        <div className="hidden md:flex items-center gap-3">
                            {isAuthenticated && user ? (
                                <UserDropdown user={user} navigate={navigate} onLogout={handleLogout} />
                            ) : (
                                <>
                                    <GhostButton href="/login" icon={User} className="cursor-pointer">
                                        Sign In
                                    </GhostButton>
                                    <PremiumButton href="/register" className="cursor-pointer">
                                        <Sparkles className="h-4 w-4" />
                                        Get Started
                                    </PremiumButton>
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileOpen(v => !v)}
                            aria-label="Toggle menu"
                            className="md:hidden relative z-10 w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                        >
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <>
                        <div
                            className="fixed inset-0 top-16 bg-black/20 z-40 md:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <div className="absolute top-full left-3 right-3 z-50 md:hidden rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden">
                            <div className="p-2">
                                {/* Main Nav Links */}
                                <div className="space-y-0.5">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-colors ${isActive(link.path)
                                                    ? "bg-gray-900 text-white"
                                                    : "text-gray-700 hover:bg-gray-100"
                                                }`}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>

                                {/* Divider */}
                                <div className="relative my-3">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="px-2 bg-white text-gray-400">Contact & Info</span>
                                    </div>
                                </div>

                                {/* Info Links */}
                                <MobileInfoLinks navigate={navigate} onClose={() => setMobileOpen(false)} currentPath={currentPath} />

                                {/* Divider */}
                                <div className="relative my-3">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-xs">
                                        <span className="px-2 bg-white text-gray-400">Account</span>
                                    </div>
                                </div>

                                {/* Auth Section */}
                                <div className="p-1">
                                    {isAuthenticated && user ? (
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarFallback className="bg-gray-800 text-white text-xs font-bold">
                                                        {getInitials(user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                </div>
                                            </div>

                                            {[
                                                { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
                                                { label: "Settings", icon: Settings, path: "/profile" },
                                                { label: "Security", icon: Shield, path: "/sessions" },
                                            ].map(({ label, icon: Icon, path }) => (
                                                <Link
                                                    key={path}
                                                    to={path}
                                                    onClick={() => setMobileOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                                                >
                                                    <Icon className="h-4 w-4 text-gray-400" />
                                                    {label}
                                                </Link>
                                            ))}

                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Logout
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <Link to="/login" onClick={() => setMobileOpen(false)}>
                                                <GhostButton className="w-full justify-center py-2.5">
                                                    Sign In
                                                </GhostButton>
                                            </Link>
                                            <Link to="/register" onClick={() => setMobileOpen(false)}>
                                                <PremiumButton className="w-full justify-center">
                                                    <Sparkles className="h-4 w-4" />
                                                    Get Started
                                                </PremiumButton>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </nav>
        </>
    );
};

// UserDropdown Component
const UserDropdown = memo(({ user, navigate, onLogout }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors">
                <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-gray-800 text-white text-xs font-bold">
                        {getInitials(user.name)}
                    </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">
                    {user.name?.split(" ")[0] || user.name}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" sideOffset={8} className="w-56 rounded-xl border border-gray-200 shadow-xl p-1.5">
            <DropdownMenuLabel className="px-2.5 py-2">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />

            {[
                { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
                { label: "Profile Settings", icon: Settings, path: "/profile" },
                { label: "Security", icon: Shield, path: "/sessions" },
            ].map(({ label, icon: Icon, path }) => (
                <DropdownMenuItem
                    key={path}
                    onClick={() => navigate(path)}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-sm text-gray-700 hover:bg-gray-50"
                >
                    <Icon className="h-4 w-4 text-gray-400" />
                    {label}
                </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
                onClick={onLogout}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer text-sm text-red-600 hover:bg-red-50"
            >
                <LogOut className="h-4 w-4" />
                Logout
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
));

UserDropdown.displayName = 'UserDropdown';

export default Navbar;