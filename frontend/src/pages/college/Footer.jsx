import { Building2, Mail, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
    ];

    const resources = [
        { name: "College Compare", href: "/compare" },
        { name: "Admission Guide", href: "/guide" },
        { name: "Scholarships", href: "/scholarships" },
        { name: "Career Insights", href: "/careers" },
    ];

    const socialLinks = ["Twitter", "LinkedIn", "Instagram", "Facebook"];

    return (
        <footer className="bg-white border-t border-gray-100 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                {/* Grid - Responsive layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">

                    {/* Brand Column */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-gray-900 flex items-center justify-center">
                                <Building2 className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-bold text-gray-900 text-lg tracking-tight">
                                College<span className="text-gray-700">Finder</span>
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Your trusted platform for discovering top colleges, comparing programs, and simplifying admissions.
                        </p>
                        <div className="flex flex-col gap-2 text-xs text-gray-500">
                            <div className="flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                                <span className="break-all">help@collegefinder.com</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                                <span>+91-1800-123-4567</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-3">
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-xs text-gray-600 hover:text-gray-900 transition-colors inline-block py-0.5"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-3">
                            Resources
                        </h4>
                        <ul className="space-y-2">
                            {resources.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-xs text-gray-600 hover:text-gray-900 transition-colors inline-block py-0.5"
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Stay Updated - Fixed alignment */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                            Stay Updated
                        </h4>

                        {/* Newsletter Subscription - Lightweight */}
                        <div className="space-y-3">
                            <p className="text-xs text-gray-600">
                                Get the latest updates about colleges and admissions.
                            </p>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent bg-gray-50"
                                    aria-label="Email for newsletter"
                                />
                                <Button
                                    size="sm"
                                    className="bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-3"
                                    aria-label="Subscribe"
                                >
                                    <Send className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex flex-wrap gap-2 pt-2">
                            {socialLinks.map((social) => (
                                <button
                                    key={social}
                                    className="text-xs text-gray-500 hover:text-gray-900 transition-colors px-2 py-1"
                                    aria-label={social}
                                >
                                    {social}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-100 mt-8 pt-6 flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
                    <p className="text-[10px] text-gray-400 text-center sm:text-left">
                        © {currentYear} CollegeFinder. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
                        <button className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors">
                            Cookie Policy
                        </button>
                        <button className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors">
                            Accessibility
                        </button>
                        <button className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors">
                            Sitemap
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;