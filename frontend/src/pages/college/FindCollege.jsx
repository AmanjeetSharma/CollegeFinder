// pages/FindCollege.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Filter,
    MapPin,
    Star,
    GraduationCap,
    BookOpen,
    Users,
    Award,
    ChevronRight,
    TrendingUp,
    Building2,
    School,
    DollarSign,
    Clock,
    ExternalLink,
    Heart,
    Share2,
    Download,
    X,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useCollege } from "../../context/CollegeContext";

const FindCollege = () => {
    const navigate = useNavigate();
    const { loading, colleges, pagination, getColleges } = useCollege();
    
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedStream, setSelectedStream] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [cutoffRange, setCutoffRange] = useState([0, 100]);
    const [selectedColleges, setSelectedColleges] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    // Get unique values for filters
    const states = [...new Set(colleges.map(c => c.location?.state).filter(Boolean))];
    const streams = [...new Set(colleges.flatMap(c => c.streams).filter(Boolean))];
    const types = [...new Set(colleges.map(c => c.type).filter(Boolean))];

    // Fetch colleges on mount and when filters change
    useEffect(() => {
        const fetchColleges = async () => {
            const params = {
                page: currentPage,
                limit: 10,
                ...(selectedState && { state: selectedState }),
                ...(selectedStream && { stream: selectedStream }),
                ...(selectedType && { type: selectedType }),
                ...(cutoffRange[0] > 0 && { minCutoff: cutoffRange[0] }),
                ...(cutoffRange[1] < 100 && { maxCutoff: cutoffRange[1] }),
            };
            await getColleges(params);
        };
        
        fetchColleges();
    }, [currentPage, selectedState, selectedStream, selectedType, cutoffRange]);

    // Filter colleges based on search query (client-side filtering)
    const filteredColleges = colleges.filter(college => {
        const matchesSearch = college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            college.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            college.location?.state?.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesSearch;
    });

    const handleSaveCollege = (collegeId) => {
        if (selectedColleges.includes(collegeId)) {
            setSelectedColleges(selectedColleges.filter(id => id !== collegeId));
        } else {
            setSelectedColleges([...selectedColleges, collegeId]);
        }
    };

    const handleViewDetails = (collegeId) => {
        navigate(`/colleges/${collegeId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-gray-900 to-gray-500 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                            Find Your Perfect College
                        </h1>
                        <p className="text-lg sm:text-xl text-blue-100 mb-8">
                            Discover top colleges across India with comprehensive information about courses, fees, placements, and more
                        </p>

                        {/* Search Bar */}
                        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by college name or location..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 py-6 bg-white text-gray-900 rounded-xl"
                                />
                            </div>
                            <Button
                                onClick={() => setShowFilters(!showFilters)}
                                variant="secondary"
                                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                            >
                                <Filter className="h-4 w-4 mr-2" />
                                Filters
                            </Button>
                        </div>
                    </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10"
                    >
                        <Card className="border-0 shadow-lg bg-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-900">Filter Colleges</h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowFilters(false)}
                                        className="text-gray-500"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div>
                                        <Label className="text-sm font-medium mb-2 block">State/UT</Label>
                                        <select
                                            value={selectedState}
                                            onChange={(e) => {
                                                setSelectedState(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">All States</option>
                                            {states.map(state => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium mb-2 block">Stream</Label>
                                        <select
                                            value={selectedStream}
                                            onChange={(e) => {
                                                setSelectedStream(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">All Streams</option>
                                            {streams.map(stream => (
                                                <option key={stream} value={stream}>{stream}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium mb-2 block">College Type</Label>
                                        <select
                                            value={selectedType}
                                            onChange={(e) => {
                                                setSelectedType(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">All Types</option>
                                            {types.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium mb-2 block">Cutoff Percentage</Label>
                                        <Slider
                                            min={0}
                                            max={100}
                                            step={1}
                                            value={cutoffRange}
                                            onValueChange={(value) => {
                                                setCutoffRange(value);
                                                setCurrentPage(1);
                                            }}
                                            className="mt-2"
                                        />
                                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                                            <span>{cutoffRange[0]}%</span>
                                            <span>{cutoffRange[1]}%</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {loading ? "Loading..." : `${filteredColleges.length} Colleges Found`}
                        </h2>
                        <p className="text-gray-500 mt-1">Based on your preferences</p>
                    </div>
                    {pagination && (
                        <div className="text-sm text-gray-500">
                            Page {pagination.page} of {pagination.totalPages}
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredColleges.map((college, index) => (
                                <motion.div
                                    key={college._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                                        <div className="relative h-48 bg-gradient-to-r from-gray-900 to-gray-500">
                                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all" />
                                            <div className="absolute top-4 right-4 flex gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="secondary"
                                                    className="bg-white/90 hover:bg-white"
                                                    onClick={() => handleSaveCollege(college._id)}
                                                >
                                                    <Heart className={`h-4 w-4 ${selectedColleges.includes(college._id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                                                </Button>
                                                <Button size="icon" variant="secondary" className="bg-white/90 hover:bg-white">
                                                    <Share2 className="h-4 w-4 text-gray-600" />
                                                </Button>
                                            </div>
                                            <div className="absolute bottom-4 left-4">
                                                <Badge className="bg-white/90 text-gray-900 hover:bg-white">
                                                    {college.type}
                                                </Badge>
                                            </div>
                                        </div>

                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-xl mb-1">{college.name}</CardTitle>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <MapPin className="h-4 w-4" />
                                                        {college.location?.city}, {college.location?.state}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                        <span className="font-semibold">{(college.rating || 4.0).toFixed(1)}</span>
                                                        <span className="text-sm text-gray-500">({college.reviews || 0})</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-4">
                                            <div className="flex flex-wrap gap-3">
                                                {college.streams?.map((stream, idx) => (
                                                    <Badge key={idx} variant="outline" className="bg-blue-50">
                                                        <GraduationCap className="h-3 w-3 mr-1" />
                                                        {stream}
                                                    </Badge>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 text-center">
                                                <div className="p-2 bg-gray-50 rounded-lg">
                                                    <p className="text-xs text-gray-500">Cutoff Percentage</p>
                                                    <p className="font-semibold text-gray-900">{college.cutoff}%</p>
                                                </div>
                                                <div className="p-2 bg-gray-50 rounded-lg">
                                                    <p className="text-xs text-gray-500">College Type</p>
                                                    <p className="font-semibold text-gray-900">{college.type}</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-3 pt-2">
                                                <Button 
                                                    className="flex-1 bg-gray-900 hover:bg-gray-800"
                                                    onClick={() => handleViewDetails(college._id)}
                                                >
                                                    View Details
                                                    <ExternalLink className="h-4 w-4 ml-2" />
                                                </Button>
                                                <Button variant="outline" className="flex-1">
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Brochure
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <div className="flex gap-2">
                                    {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                                        let pageNum;
                                        if (pagination.totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= pagination.totalPages - 2) {
                                            pageNum = pagination.totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }
                                        
                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={currentPage === pageNum ? "default" : "outline"}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={currentPage === pageNum ? "bg-gray-900" : ""}
                                            >
                                                {pageNum}
                                            </Button>
                                        );
                                    })}
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                                    disabled={currentPage === pagination.totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        )}

                        {filteredColleges.length === 0 && (
                            <div className="text-center py-12">
                                <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No colleges found</h3>
                                <p className="text-gray-500">Try adjusting your filters or search criteria</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default FindCollege;