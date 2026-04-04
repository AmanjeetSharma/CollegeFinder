// pages/CollegeDetail.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft, MapPin, Star, GraduationCap, Building2, TrendingUp,
    ExternalLink, Share2, CheckCircle, Globe, Phone, Mail,
    Loader2, Award, ChevronRight, Sparkles, Shield, Zap,
} from "lucide-react";
import { FaBookmark } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCollege } from "../../context/CollegeContext";
import { schadenToast } from "@/components/schadenToast/ToastConfig.jsx";
import Footer from "./Footer";

/* ── Random hero pool — new image every page visit ── */
const HERO_IMAGES = [
    "https://images.unsplash.com/photo-1562774053-701939374585?w=1400&q=80",
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1400&q=80",
    "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1400&q=80",
    "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1400&q=80",
    "https://images.unsplash.com/photo-1596496050755-c923e73e42e1?w=1400&q=80",
];

/* ── Sub-components ── */
const SectionLabel = ({ children }) => (
    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-3">{children}</p>
);

const ContactRow = ({ icon: Icon, sub, children }) => (
    <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            <Icon className="h-3.5 w-3.5 text-gray-500" />
        </div>
        <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">{sub}</p>
            {children}
        </div>
    </div>
);

/* ══════════════════════════════════════════════════════ */

const CollegeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { loading, selectedCollege, getCollegeById } = useCollege();
    const [isSaved, setIsSaved] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");

    // Stable random hero — picked once on mount, never re-rolls on re-render
    const heroImg = useRef(
        HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)]
    ).current;

    useEffect(() => { if (id) getCollegeById(id); }, [id]);

    /* ── Loading ── */
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-3">
                <Loader2 className="h-7 w-7 animate-spin text-gray-900" />
                <p className="text-sm text-gray-400">Loading…</p>
            </div>
        );
    }

    /* ── Not found ── */
    if (!selectedCollege) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4 text-center px-4">
                <Building2 className="h-12 w-12 text-gray-300" />
                <h2 className="text-lg font-semibold text-gray-900">College not found</h2>
                <p className="text-sm text-gray-400">This page doesn't exist or has been removed.</p>
                <Button onClick={() => navigate("/colleges")} className="rounded-full bg-gray-900 hover:bg-gray-700 mt-1">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Colleges
                </Button>
            </div>
        );
    }

    const c = selectedCollege;
    const isOpen = c.admissionStatus === "Open";

    return (
        <div className="min-h-screen bg-[#fafaf9]">

            {/* ══════════════════════════════════════
                PAGE TOPBAR — NOT sticky.
                The app's own <Navbar> is sticky at top-0.
                This bar sits right below the hero as a back/actions row.
            ══════════════════════════════════════ */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
                    <button
                        onClick={() => navigate("/colleges")}
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                        <span className="hidden sm:inline font-medium">Back to Colleges</span>
                    </button>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => {
                                setIsSaved(!isSaved);
                                if (!isSaved) {
                                    schadenToast.success("College Bookmarked", {
                                        duration: 1500,
                                        position: "top-center",
                                    });
                                } else {
                                    schadenToast.success("Bookmark Removed", {
                                        duration: 1500,
                                        position: "top-center",
                                    });
                                }
                            }}
                            className={`p-2 rounded-full transition-all ${isSaved ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-400"}`}
                        >
                            <FaBookmark className={`h-4 w-4 ${isSaved ? "fill-white" : ""}`} />
                        </button>
                        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                            <Share2 className="h-4 w-4 text-gray-900" />
                        </button>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════
                HERO — random image, name + meta overlay
                Added badges: Scholarships Available + College ID
            ══════════════════════════════════════ */}
            <div className="relative h-[50vh] min-h-75 sm:min-h-95 overflow-hidden">
                <img
                    src={heroImg}
                    alt={c.name}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Gradient: transparent top → dark bottom so text pops */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-900/40 to-transparent" />

                {/* Badges Container - Top Right Corner */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 flex flex-col gap-2">
                    {/* Scholarships Available Badge */}
                    {c.scholarshipsAvailableStatus && (
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                                <span className="text-[10px] sm:text-xs font-bold text-white whitespace-nowrap">
                                    Scholarships Available
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8"
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-3">
                        {c.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-gray-300">
                        <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-gray-400" />
                            {c.location?.city}, {c.location?.state}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5 text-gray-400" />
                            {c.type}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                            4.5 / 5.0 (124 reviews)
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Award className="h-3.5 w-3.5 text-gray-400" />
                            {c.affiliation}
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* STICKY STATUS STRIP */}

            <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-gray-700 truncate">{c.name}</p>
                    <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold flex-shrink-0
                            ${isOpen
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-red-50 text-red-600 border border-red-200"}`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                        Admissions {c.admissionStatus}
                    </span>
                </div>
            </div>

            {/* ══════════════════════════════════════
                BODY — 2-column grid
            ══════════════════════════════════════ */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">

                    {/* ── Main content ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.5 }}
                    >
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            {/* Tab strip */}
                            <TabsList className="flex gap-0 bg-transparent p-0 mb-6 border-b border-gray-200 w-full justify-start rounded-none h-auto">
                                {[
                                    { value: "overview", label: "Overview" },
                                    { value: "courses", label: "Courses" },
                                    { value: "admission", label: "Admission" },
                                ].map((t) => (
                                    <TabsTrigger
                                        key={t.value}
                                        value={t.value}
                                        className={`relative pb-3 px-1 mr-7 text-sm font-semibold rounded-none border-0 bg-transparent shadow-none transition-colors
                                            data-[state=active]:bg-transparent data-[state=active]:shadow-none
                                            ${activeTab === t.value ? "text-gray-900" : "text-gray-400 hover:text-gray-700"}`}
                                    >
                                        {t.label}
                                        {activeTab === t.value && (
                                            <motion.span
                                                layoutId="tab-line"
                                                className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-900 rounded-full"
                                            />
                                        )}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {/* ─── OVERVIEW ─── */}
                            <TabsContent value="overview" className="mt-0 space-y-5">
                                {/* 3 stat tiles */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {[
                                        { icon: TrendingUp, label: "Min. Cutoff", value: `${c.cutoff}%`, bg: "bg-emerald-500" },
                                        { icon: GraduationCap, label: "Streams", value: `${c.streams?.length ?? 0} offered`, bg: "bg-blue-500" },
                                        { icon: Shield, label: "Facilities", value: `${c.facilities?.length ?? 0} on campus`, bg: "bg-violet-500" },
                                    ].map(({ icon: Icon, label, value, bg }) => (
                                        <div key={label} className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
                                                <Icon className="h-4 w-4 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</p>
                                                <p className="text-sm font-bold text-gray-900">{value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Facilities */}
                                <Card className="border-0 shadow-sm rounded-2xl">
                                    <CardContent className="p-5 sm:p-6">
                                        <SectionLabel>Facilities</SectionLabel>
                                        <div className="flex flex-wrap gap-2">
                                            {c.facilities?.slice(0, 8).map((f, i) => (
                                                <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-100 rounded-xl text-gray-700">
                                                    <CheckCircle className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                                                    {f}
                                                </span>
                                            ))}
                                            {c.facilities?.length > 8 && (
                                                <span className="inline-flex items-center px-2.5 py-1.5 text-xs bg-gray-50 rounded-xl text-gray-400">
                                                    +{c.facilities.length - 8} more
                                                </span>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Scholarships — only if available */}
                                {c.scholarshipsAvailableStatus && c.scholarshipsAvailable?.length > 0 && (
                                    <Card className="border-0 shadow-sm rounded-2xl bg-amber-50/50">
                                        <CardContent className="p-5 sm:p-6">
                                            <SectionLabel>Scholarships</SectionLabel>
                                            <div className="flex flex-wrap gap-2">
                                                {c.scholarshipsAvailable.map((s, i) => (
                                                    <Badge key={i} className="bg-amber-100 text-amber-800 border-0 rounded-xl px-2.5 py-1 text-xs font-semibold">
                                                        <Sparkles className="h-3 w-3 mr-1" /> {s}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            {/* ─── COURSES ─── */}
                            <TabsContent value="courses" className="mt-0 space-y-3">
                                <SectionLabel>Programmes Offered</SectionLabel>
                                {c.streams?.map((stream, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <Card className="border-0 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                                            <CardContent className="p-4 sm:p-5">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
                                                        <GraduationCap className="h-4 w-4 text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm">{stream}</p>
                                                        <p className="text-xs text-gray-400">Full Time · Regular</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {[
                                                        { label: "Duration", value: "3–4 Years" },
                                                        { label: "Eligibility", value: `10+2 · ${c.cutoff}%` },
                                                        { label: "Mode", value: "On Campus" },
                                                    ].map(({ label, value }) => (
                                                        <div key={label} className="bg-gray-50 rounded-xl p-2.5 text-center">
                                                            <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                                                            <p className="text-[11px] font-semibold text-gray-800">{value}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </TabsContent>

                            {/* ─── ADMISSION ─── */}
                            <TabsContent value="admission" className="mt-0 space-y-5">
                                {/* Status banner */}
                                <div className={`flex items-center gap-4 p-4 rounded-2xl ${isOpen ? "bg-emerald-50 border border-emerald-100" : "bg-red-50 border border-red-100"}`}>
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isOpen ? "bg-emerald-500" : "bg-red-500"}`}>
                                        <Zap className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <p className={`font-bold text-sm ${isOpen ? "text-emerald-800" : "text-red-800"}`}>
                                            {isOpen ? "Applications Currently Open" : "Admissions Closed"}
                                        </p>
                                        <p className={`text-xs mt-0.5 ${isOpen ? "text-emerald-600" : "text-red-500"}`}>
                                            {isOpen ? "Apply before the deadline to secure your seat." : "Applications for the current session are not accepted."}
                                        </p>
                                    </div>
                                </div>

                                {/* Steps */}
                                <Card className="border-0 shadow-sm rounded-2xl">
                                    <CardContent className="p-5 sm:p-6">
                                        <SectionLabel>How to Apply</SectionLabel>
                                        <div className="space-y-4 mt-2">
                                            {[
                                                { title: "Fill Application Form", desc: "Complete the online form with your personal and academic details." },
                                                { title: "Merit / Entrance Exam", desc: `Merit-based admission — minimum cutoff of ${c.cutoff}%.` },
                                                { title: "Counseling & Seat Allotment", desc: "Shortlisted candidates attend counseling for seat confirmation." },
                                                { title: "Document Verification & Fee", desc: "Submit documents and pay the fee to confirm your seat." },
                                            ].map((step, i, arr) => (
                                                <div key={i} className="flex gap-4">
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                                                            {i + 1}
                                                        </div>
                                                        {i < arr.length - 1 && <div className="w-px flex-1 bg-gray-100 my-1.5" />}
                                                    </div>
                                                    <div className={i < arr.length - 1 ? "pb-4" : ""}>
                                                        <p className="font-semibold text-gray-900 text-sm">{step.title}</p>
                                                        <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{step.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </motion.div>

                    {/* ── Sidebar — sticky below status strip (top-27 = 64px navbar + 44px strip) ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25, duration: 0.5 }}
                        className="space-y-4 lg:sticky lg:top-[108px]"
                    >
                        {/* CTA */}
                        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-gray-900 text-white">
                            <CardContent className="p-5">
                                <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Ready to join?</p>
                                <p className="text-base font-bold mb-4">Start Your Application</p>
                                <Button className="w-full rounded-xl bg-white text-gray-900 hover:bg-gray-100 font-semibold h-10 mb-2">
                                    Apply Now <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                                <Button variant="ghost" className="w-full rounded-xl text-gray-500 hover:bg-white/10 hover:text-white h-9 text-sm">
                                    Download Brochure
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Contact */}
                        <Card className="border-0 shadow-sm rounded-2xl">
                            <CardContent className="p-5 space-y-3.5">
                                <SectionLabel>Contact</SectionLabel>
                                <ContactRow icon={MapPin} sub="Location">
                                    <p className="text-xs font-medium text-gray-700">{c.location?.city}, {c.location?.state}</p>
                                </ContactRow>
                                {c.contact?.phone && (
                                    <ContactRow icon={Phone} sub="Phone">
                                        <a href={`tel:+91${c.contact.phone}`} className="text-xs font-medium text-gray-700 hover:text-gray-900">
                                            +91-{c.contact.phone}
                                        </a>
                                    </ContactRow>
                                )}
                                {c.contact?.email && (
                                    <ContactRow icon={Mail} sub="Email">
                                        <a href={`mailto:${c.contact.email}`} className="text-xs text-blue-600 hover:underline break-all">
                                            {c.contact.email}
                                        </a>
                                    </ContactRow>
                                )}
                                {c.contact?.website && (
                                    <ContactRow icon={Globe} sub="Website">
                                        <a href={c.contact.website} target="_blank" rel="noopener noreferrer"
                                            className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                                            Visit Site <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </ContactRow>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CollegeDetails;