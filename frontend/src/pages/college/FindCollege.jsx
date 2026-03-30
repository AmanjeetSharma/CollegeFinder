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
    TrendingUp,
    Building2,
    ExternalLink,
    Heart,
    Share2,
    X,
    Loader2,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useCollege } from "../../context/CollegeContext";

const FindCollege = () => {
    const navigate = useNavigate();
    const { loading, colleges, pagination, getColleges, stateUTs } = useCollege();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedStream, setSelectedStream] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [cutoffRange, setCutoffRange] = useState([0, 100]);
    const [tempCutoffRange, setTempCutoffRange] = useState([0, 100]);
    const [selectedColleges, setSelectedColleges] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageInput, setPageInput] = useState("");
    const [hasAppliedFilters, setHasAppliedFilters] = useState(false);
    const [stateSearchQuery, setStateSearchQuery] = useState("");

    // Get unique values for filters from actual data
    const streams = [...new Set(colleges.flatMap(c => c.streams).filter(Boolean))];
    const types = [...new Set(colleges.map(c => c.type).filter(Boolean))];

    // Filter states based on search query - using stateUTs from context
    const filteredStates = stateUTs.filter(state =>
        state.toLowerCase().includes(stateSearchQuery.toLowerCase())
    );

    // Check if any filters are active
    const hasActiveFilters = selectedState || selectedStream || selectedType ||
        cutoffRange[0] > 0 || cutoffRange[1] < 100;

    // Apply filters
    const applyFilters = () => {
        setCutoffRange(tempCutoffRange);
        setHasAppliedFilters(true);
        setCurrentPage(1);
    };

    // Reset all filters
    const resetFilters = () => {
        setSelectedState("");
        setSelectedStream("");
        setSelectedType("");
        setTempCutoffRange([0, 100]);
        setCutoffRange([0, 100]);
        setHasAppliedFilters(false);
        setCurrentPage(1);
        setStateSearchQuery("");
    };

    // Fetch colleges when filters are applied or page changes
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

    const handlePageChange = (page) => {
        if (page >= 1 && page <= (pagination?.totalPages || 1)) {
            setCurrentPage(page);
            setPageInput("");
        }
    };

    const handlePageInputSubmit = (e) => {
        e.preventDefault();
        const pageNum = parseInt(pageInput);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= (pagination?.totalPages || 1)) {
            setCurrentPage(pageNum);
            setPageInput("");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-gray-900 to-gray-700 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                            Find Your Perfect College
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-200 mb-8">
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
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Search state or UT..."
                                                value={stateSearchQuery}
                                                onChange={(e) => setStateSearchQuery(e.target.value)}
                                                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <select
                                            value={selectedState}
                                            onChange={(e) => setSelectedState(e.target.value)}
                                            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                                            size={Math.min(5, filteredStates.length)}
                                        >
                                            <option value="">All States/UTs</option>
                                            {filteredStates.map(state => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                        {filteredStates.length === 0 && stateSearchQuery && (
                                            <p className="text-xs text-red-500 mt-1">No matching state/UT found</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium mb-2 block">Stream</Label>
                                        <select
                                            value={selectedStream}
                                            onChange={(e) => setSelectedStream(e.target.value)}
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
                                            onChange={(e) => setSelectedType(e.target.value)}
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
                                            value={tempCutoffRange}
                                            onValueChange={setTempCutoffRange}
                                            className="mt-2"
                                        />
                                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                                            <span>{tempCutoffRange[0]}%</span>
                                            <span>{tempCutoffRange[1]}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Filter Action Buttons */}
                                <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                                    <Button
                                        onClick={applyFilters}
                                        className="flex-1 bg-gray-900 hover:bg-gray-800"
                                    >
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        Apply Filters
                                    </Button>
                                    <Button
                                        onClick={resetFilters}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Reset Filters
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                    <div className="flex flex-wrap items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <span className="text-sm font-medium text-blue-700">Active Filters:</span>
                        {selectedState && (
                            <Badge className="bg-blue-100 text-blue-700">
                                State: {selectedState}
                            </Badge>
                        )}
                        {selectedStream && (
                            <Badge className="bg-blue-100 text-blue-700">
                                Stream: {selectedStream}
                            </Badge>
                        )}
                        {selectedType && (
                            <Badge className="bg-blue-100 text-blue-700">
                                Type: {selectedType}
                            </Badge>
                        )}
                        {(cutoffRange[0] > 0 || cutoffRange[1] < 100) && (
                            <Badge className="bg-blue-100 text-blue-700">
                                Cutoff: {cutoffRange[0]}% - {cutoffRange[1]}%
                            </Badge>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={resetFilters}
                            className="ml-auto text-blue-700 hover:text-blue-800 hover:bg-blue-100"
                        >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Clear All
                        </Button>
                    </div>
                </div>
            )}

            {/* Results Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {loading ? "Loading..." : `${filteredColleges.length} Colleges Found`}
                        </h2>
                        <p className="text-gray-500 mt-1">Based on your preferences</p>
                    </div>
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
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ y: -8 }}
                                    className="perspective-1000"
                                >
                                    <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group transform-gpu hover:rotate-x-2">
                                        <CardHeader className="pb-3 bg-gradient-to-br from-white to-gray-50/50">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <CardTitle className="text-xl mb-2 transition-colors group-hover:text-blue-600 line-clamp-2">
                                                        {college.name}
                                                    </CardTitle>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <MapPin className="h-4 w-4" />
                                                        {college.location?.city}, {college.location?.state}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="hover:bg-red-50 hover:scale-110 transition-transform"
                                                        onClick={() => handleSaveCollege(college._id)}
                                                    >
                                                        <Heart className={`h-5 w-5 transition-all ${selectedColleges.includes(college._id) ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-400'}`} />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="hover:bg-gray-100 hover:scale-110 transition-transform">
                                                        <Share2 className="h-5 w-5 text-gray-400" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-4 pt-4">
                                            {/* Quick Stats Row - Enhanced with 3D effect */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 text-center border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group/stat">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/stat:translate-x-[100%] transition-transform duration-700" />
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs text-gray-500">Cutoff</span>
                                                        <TrendingUp className="h-3 w-3 text-green-500" />
                                                    </div>
                                                    <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                                        {college.cutoff}%
                                                    </p>
                                                    <p className="text-xs text-green-600 mt-1">Required Score</p>
                                                </div>
                                                <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 text-center border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group/stat">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/stat:translate-x-[100%] transition-transform duration-700" />
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs text-gray-500">Type</span>
                                                        <Building2 className="h-3 w-3 text-blue-500" />
                                                    </div>
                                                    <p className="text-base font-semibold text-gray-900 truncate">
                                                        {college.type}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">Institution</p>
                                                </div>
                                            </div>

                                            {/* Streams Tags - Enhanced */}
                                            <div className="space-y-1.5">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Streams</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {college.streams?.slice(0, 3).map((stream, idx) => (
                                                        <Badge
                                                            key={idx}
                                                            variant="outline"
                                                            className="text-xs bg-gradient-to-r from-gray-50 to-white border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
                                                        >
                                                            {stream}
                                                        </Badge>
                                                    ))}
                                                    {college.streams?.length > 3 && (
                                                        <Badge variant="outline" className="text-xs bg-gray-100 border-gray-200 hover:bg-gray-200 transition-colors">
                                                            +{college.streams.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Buttons - Enhanced */}
                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    size="sm"
                                                    className="flex-1 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-sm shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                                                    onClick={() => handleViewDetails(college._id)}
                                                >
                                                    View Details
                                                    <ExternalLink className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="px-3 hover:scale-105 transition-transform duration-300 hover:border-red-200 hover:bg-red-50 group"
                                                    onClick={() => handleSaveCollege(college._id)}
                                                >
                                                    <Heart className={`h-3.5 w-3.5 transition-all ${selectedColleges.includes(college._id) ? 'fill-red-500 text-red-500' : 'text-gray-500 group-hover:text-red-500'}`} />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {/* Enhanced Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 hover:scale-105 transition-transform"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>

                                    {/* Page numbers */}
                                    <div className="flex gap-2">
                                        {(() => {
                                            const totalPages = pagination.totalPages;
                                            const current = currentPage;
                                            let pages = [];

                                            if (totalPages <= 7) {
                                                for (let i = 1; i <= totalPages; i++) {
                                                    pages.push(i);
                                                }
                                            } else {
                                                if (current <= 3) {
                                                    pages = [1, 2, 3, 4, '...', totalPages];
                                                } else if (current >= totalPages - 2) {
                                                    pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
                                                } else {
                                                    pages = [1, '...', current - 1, current, current + 1, '...', totalPages];
                                                }
                                            }

                                            return pages.map((page, idx) => (
                                                page === '...' ? (
                                                    <span key={idx} className="px-3 py-2 text-gray-500">...</span>
                                                ) : (
                                                    <Button
                                                        key={idx}
                                                        variant={currentPage === page ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => handlePageChange(page)}
                                                        className={currentPage === page ? "bg-gray-900 hover:bg-gray-800 shadow-md" : "hover:scale-105 transition-transform"}
                                                    >
                                                        {page}
                                                    </Button>
                                                )
                                            ));
                                        })()}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === pagination.totalPages}
                                        className="px-3 hover:scale-105 transition-transform"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Page input */}
                                <form onSubmit={handlePageInputSubmit} className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">Go to page</span>
                                    <input
                                        type="number"
                                        value={pageInput}
                                        onChange={(e) => setPageInput(e.target.value)}
                                        min={1}
                                        max={pagination.totalPages}
                                        className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="..."
                                    />
                                    <Button type="submit" size="sm" variant="outline" className="hover:scale-105 transition-transform">
                                        Go
                                    </Button>
                                </form>
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