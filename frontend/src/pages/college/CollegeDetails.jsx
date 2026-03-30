// pages/CollegeDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    MapPin,
    Star,
    GraduationCap,
    BookOpen,
    Users,
    Award,
    TrendingUp,
    Building2,
    School,
    DollarSign,
    Clock,
    ExternalLink,
    Heart,
    Share2,
    Download,
    CheckCircle,
    Globe,
    Phone,
    Mail,
    Calendar,
    Loader2,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCollege } from "../../context/CollegeContext";

const CollegeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { loading, selectedCollege, getCollegeById } = useCollege();
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (id) {
            getCollegeById(id);
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!selectedCollege) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
                <Building2 className="h-16 w-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">College not found</h2>
                <p className="text-gray-500 mb-4">The college you're looking for doesn't exist or has been removed.</p>
                <Button onClick={() => navigate("/find-college")} className="bg-gray-900 hover:bg-gray-800">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Colleges
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-gray-900 to-gray-500 text-white">
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/find-college")}
                            className="mb-6 text-white hover:bg-white/20"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Colleges
                        </Button>

                        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                            <div className="flex-1">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                                    {selectedCollege.name}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-gray-200">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        <span>{selectedCollege.location?.city}, {selectedCollege.location?.state}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                        <span>{(selectedCollege.rating || 0).toFixed(1)} Rating</span>
                                        <span className="text-sm">({selectedCollege.reviews || 0} reviews)</span>
                                    </div>
                                    <Badge className="bg-white/20 text-white hover:bg-white/30">
                                        {selectedCollege.type}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="secondary"
                                    className="bg-white/20 hover:bg-white/30 text-white"
                                    onClick={() => setIsSaved(!isSaved)}
                                >
                                    <Heart className={`h-4 w-4 mr-2 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                                    {isSaved ? "Saved" : "Save"}
                                </Button>
                                <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Share
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="courses">Courses & Fees</TabsTrigger>
                                    <TabsTrigger value="admission">Admission</TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="mt-6 space-y-6">
                                    {/* About Section */}
                                    <Card className="border-0 shadow-md">
                                        <CardHeader>
                                            <CardTitle className="text-xl">About {selectedCollege.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-600 leading-relaxed">
                                                {selectedCollege.description || `${selectedCollege.name} is a premier educational institution located in ${selectedCollege.location?.city}, ${selectedCollege.location?.state}. It offers a wide range of programs across various streams and is known for its academic excellence and state-of-the-art facilities.`}
                                            </p>
                                        </CardContent>
                                    </Card>

                                    {/* Key Highlights */}
                                    <Card className="border-0 shadow-md">
                                        <CardHeader>
                                            <CardTitle className="text-xl">Key Highlights</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {selectedCollege.streams?.map((stream, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                        <GraduationCap className="h-5 w-5 text-blue-500" />
                                                        <div>
                                                            <p className="text-sm text-gray-500">Stream</p>
                                                            <p className="font-semibold text-gray-900">{stream}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <TrendingUp className="h-5 w-5 text-green-500" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Cutoff</p>
                                                        <p className="font-semibold text-gray-900">{selectedCollege.cutoff}%</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <Building2 className="h-5 w-5 text-purple-500" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">College Type</p>
                                                        <p className="font-semibold text-gray-900">{selectedCollege.type}</p>
                                                    </div>
                                                </div>
                                                {selectedCollege.placement && (
                                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                        <DollarSign className="h-5 w-5 text-yellow-500" />
                                                        <div>
                                                            <p className="text-sm text-gray-500">Average Package</p>
                                                            <p className="font-semibold text-gray-900">{selectedCollege.placement}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Facilities */}
                                    <Card className="border-0 shadow-md">
                                        <CardHeader>
                                            <CardTitle className="text-xl">Facilities & Infrastructure</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {["Library", "Sports Complex", "Hostel", "Cafeteria", "Medical Facility", "Transport", "Wi-Fi Campus", "Auditorium", "Laboratories"].map((facility, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                                        <span className="text-sm text-gray-700">{facility}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="courses" className="mt-6">
                                    <Card className="border-0 shadow-md">
                                        <CardHeader>
                                            <CardTitle className="text-xl">Courses Offered</CardTitle>
                                            <CardDescription>Detailed information about courses, fees, and duration</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {selectedCollege.streams?.map((stream, idx) => (
                                                    <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                        <div className="flex flex-wrap justify-between items-start mb-3">
                                                            <h3 className="font-semibold text-gray-900">{stream}</h3>
                                                            <Badge className="bg-blue-100 text-blue-700">Full Time</Badge>
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                                            <div>
                                                                <p className="text-gray-500">Duration</p>
                                                                <p className="font-medium">3-4 Years</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-500">Annual Fees</p>
                                                                <p className="font-medium">₹{(selectedCollege.fees || 50000).toLocaleString()}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-500">Eligibility</p>
                                                                <p className="font-medium">10+2 with {selectedCollege.cutoff}%</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="admission" className="mt-6 space-y-6">
                                    <Card className="border-0 shadow-md">
                                        <CardHeader>
                                            <CardTitle className="text-xl">Admission Process</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">1</div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Application Form</h4>
                                                    <p className="text-gray-600">Fill out the online application form with your personal and academic details.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">2</div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Entrance Exam</h4>
                                                    <p className="text-gray-600">Appear for the relevant entrance exam. Minimum cutoff: {selectedCollege.cutoff}%</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">3</div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Counseling & Seat Allotment</h4>
                                                    <p className="text-gray-600">Based on your rank, you'll be called for counseling and seat allotment.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">4</div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Document Verification & Fee Payment</h4>
                                                    <p className="text-gray-600">Complete document verification and pay the admission fee to confirm your seat.</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-0 shadow-md">
                                        <CardHeader>
                                            <CardTitle className="text-xl">Important Dates</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                    <span className="text-gray-600">Application Start Date</span>
                                                    <span className="font-medium">January 15, 2025</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                    <span className="text-gray-600">Application End Date</span>
                                                    <span className="font-medium">March 30, 2025</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                                    <span className="text-gray-600">Entrance Exam Date</span>
                                                    <span className="font-medium">April 15, 2025</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2">
                                                    <span className="text-gray-600">Result Declaration</span>
                                                    <span className="font-medium">May 30, 2025</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {/* Contact Information */}
                            <Card className="border-0 shadow-md">
                                <CardHeader>
                                    <CardTitle className="text-xl">Contact Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Address</p>
                                            <p className="text-gray-700">{selectedCollege.location?.city}, {selectedCollege.location?.state}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="text-gray-700">+91-XXXXXXXXXX</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="text-gray-700">admissions@{selectedCollege.name.toLowerCase().replace(/\s/g, '')}.edu.in</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Globe className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Website</p>
                                            <p className="text-blue-600 hover:underline">www.{selectedCollege.name.toLowerCase().replace(/\s/g, '')}.edu.in</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card className="border-0 shadow-md">
                                <CardHeader>
                                    <CardTitle className="text-xl">Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button className="w-full bg-gray-900 hover:bg-gray-800">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download Brochure
                                    </Button>
                                    <Button variant="outline" className="w-full">
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Apply Now
                                    </Button>
                                    <Button variant="outline" className="w-full">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Schedule a Visit
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Similar Colleges */}
                            <Card className="border-0 shadow-md">
                                <CardHeader>
                                    <CardTitle className="text-xl">Similar Colleges</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {[1, 2, 3].map((item) => (
                                        <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                                            <div>
                                                <p className="font-medium text-gray-900">Similar College {item}</p>
                                                <p className="text-sm text-gray-500">{selectedCollege.location?.city}</p>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-gray-400" />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollegeDetail;