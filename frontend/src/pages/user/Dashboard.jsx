// pages/Dashboard.jsx
import { useState, useEffect } from "react";
import AllTests from "./AllTests";
import TakeTestButton from "../../components/test/TakeTestButton";
import TestSetupForm from "../../components/test/TestSetupForm";
import TestLoader from "../../components/test/TestLoader";
import { axiosInstance } from "../../lib/http";
import { motion, AnimatePresence } from "framer-motion";
import { schadenToast } from "@/components/schadenToast/ToastConfig.jsx";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    TrendingUp,
    BookOpen,
    Award,
    Calendar,
    Clock,
    ChevronRight,
    Sparkles,
    Target,
    GraduationCap,
    Briefcase,
    Trophy,
    ArrowRight,
    Brain,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Mock data for dashboard
    const [progressData, setProgressData] = useState({
        completedTests: 3,
        totalTests: 5,
        recommendedCourses: 4,
        upcomingDeadlines: 2,
        aptitudeScore: 85,
        careerMatches: 3
    });

    const [recentTests, setRecentTests] = useState([]);
    // Fetch recent tests for activity
    useEffect(() => {
        if (!user?._id) return;
        axiosInstance.get(`/test/user/${user._id}/recent?limit=3`)
            .then(res => {
                setRecentTests(res.data.tests);
            });
    }, [user]);

    // Fetch all tests and compute aptitude data
    const [aptitudeData, setAptitudeData] = useState([]);
    useEffect(() => {
        if (!user?._id) return;
        axiosInstance.get(`/test/user/${user._id}`)
            .then(res => {
                const tests = res.data.tests;
                // Aggregate section scores
                const sectionScores = {};
                const sectionCounts = {};
                tests.forEach(test => {
                    test.sections.forEach(section => {
                        if (!sectionScores[section.sectionName]) {
                            sectionScores[section.sectionName] = 0;
                            sectionCounts[section.sectionName] = 0;
                        }
                        sectionScores[section.sectionName] += section.sectionScore;
                        sectionCounts[section.sectionName] += 1;
                    });
                });
                const data = Object.keys(sectionScores).map(subject => ({
                    subject,
                    score: Math.round(sectionScores[subject] / sectionCounts[subject])
                }));
                setAptitudeData(data);
            });
    }, [user]);

    const careerPaths = [
        { name: "Data Science", match: 92, color: "#3B82F6", requirements: ["Mathematics", "Programming"] },
        { name: "Engineering", match: 88, color: "#10B981", requirements: ["Physics", "Mathematics"] },
        { name: "Medicine", match: 76, color: "#F59E0B", requirements: ["Biology", "Chemistry"] }
    ];

    const upcomingEvents = [
        { name: "JEE Main 2024", date: "2024-04-15", type: "exam" },
        { name: "NEET 2024", date: "2024-05-05", type: "exam" },
        { name: "Scholarship Application", date: "2024-03-30", type: "scholarship" }
    ];

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
    };

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'test': return <Brain className="h-4 w-4 text-blue-500" />;
            case 'career': return <Briefcase className="h-4 w-4 text-green-500" />;
            case 'deadline': return <Calendar className="h-4 w-4 text-red-500" />;
            case 'course': return <BookOpen className="h-4 w-4 text-purple-500" />;
            default: return <Sparkles className="h-4 w-4 text-gray-500" />;
        }
    };

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    // Modal state for test setup
    const [showTestSetup, setShowTestSetup] = useState(false);
    const [loadingTest, setLoadingTest] = useState(false);
    const [testData, setTestData] = useState(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section with Animation */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8"
                >
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Welcome back, {user?.name?.split(' ')[0]}! 👋
                        </h1>
                        <p className="text-gray-500 mt-1">Your personalized career guidance dashboard</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/profile')}
                            className="border-gray-400 hover:bg-gray-200 cursor-pointer hover:bg-gray-900 hover:text-white"
                        >
                            <GraduationCap className="h-4 w-4 mr-2" />
                            View Profile
                        </Button>
                        <TakeTestButton onClick={() => setShowTestSetup(true)} />
                    </div>
                    <TestSetupForm
                        open={showTestSetup}
                        onClose={() => setShowTestSetup(false)}
                        onSubmit={async ({ studentClass, interests }) => {
                            setShowTestSetup(false);
                            setLoadingTest(true);
                            try {
                                const res = await axiosInstance.post("/test/build", {
                                    studentClass,
                                    interest: interests
                                });
                                setTestData(res.data.questions);
                                navigate("/take-test", { state: { test: res.data.questions } });
                            } catch (err) {
                                const msg = err?.response?.data?.message ||
                                    "Failed to generate test. Please try again later.";
                                schadenToast.error(msg, {
                                    description: "The AI service may be busy. Please try again in a few moments.",
                                });
                            } finally {
                                setLoadingTest(false);
                            }
                        }}
                    />
                    <TestLoader open={loadingTest} />
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    {[
                        { icon: Brain, label: "Aptitude Score", value: `${progressData.aptitudeScore}%`, color: "from-blue-500 to-blue-600", trend: "+5%" },
                        { icon: Target, label: "Career Matches", value: progressData.careerMatches, color: "from-green-500 to-green-600", trend: "+2" },
                        { icon: BookOpen, label: "Courses Completed", value: `${progressData.completedTests}/${progressData.totalTests}`, color: "from-purple-500 to-purple-600", trend: "2 left" },
                        { icon: Award, label: "Recommendations", value: progressData.recommendedCourses, color: "from-orange-500 to-orange-600", trend: "new" }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-10`}>
                                            <stat.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                                            {stat.trend}
                                        </Badge>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Aptitude Progress Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-blue-500" />
                                    Aptitude Analysis
                                </CardTitle>
                                <CardDescription>Your performance across different subjects</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={aptitudeData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                            <XAxis dataKey="subject" stroke="#6B7280" />
                                            <YAxis stroke="#6B7280" />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="score"
                                                stroke="#3B82F6"
                                                strokeWidth={2}
                                                dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                                                activeDot={{ r: 8 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Career Recommendations */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="border-0 shadow-lg h-full">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-purple-500" />
                                    AI Career Matches
                                </CardTitle>
                                <CardDescription>Based on your aptitude and interests</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {careerPaths.map((career, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.02 }}
                                        className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl cursor-pointer hover:shadow-md transition-all"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-gray-900">{career.name}</h3>
                                            <Badge style={{ backgroundColor: career.color }} className="text-white">
                                                {career.match}% Match
                                            </Badge>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${career.match}%` }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                className="h-2 rounded-full"
                                                style={{ backgroundColor: career.color }}
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {career.requirements.map((req, idx) => (
                                                <Badge key={idx} variant="outline" className="text-xs">
                                                    {req}
                                                </Badge>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                                <Button
                                    variant="ghost"
                                    className="w-full mt-4 text-blue-600 hover:text-blue-700"
                                    onClick={() => navigate('/career-guidance')}
                                >
                                    View All Recommendations
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Recent Tests Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2"
                    >
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-gray-500" />
                                    Recent Tests
                                </CardTitle>
                                <CardDescription>Your latest test attempts</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentTests.length === 0 && <div className="text-gray-500">No recent tests.</div>}
                                    {recentTests.map((test, idx) => (
                                        <motion.div
                                            key={test._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + idx * 0.1 }}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <div>
                                                <div className="font-medium text-gray-900">Test {idx + 1}</div>
                                                <div className="text-sm text-gray-500">{new Date(test.createdAt).toLocaleString()}</div>
                                            </div>
                                            <div className="text-lg font-bold">{test.totalScore}%</div>
                                        </motion.div>
                                    ))}
                                    <Button variant="outline" className="mt-2 w-full" onClick={() => navigate('/all-tests')}>
                                        See all activity
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Upcoming Events */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-orange-500" />
                                    Upcoming Deadlines
                                </CardTitle>
                                <CardDescription>Important dates and events</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {upcomingEvents.map((event, index) => (
                                        <motion.div
                                            key={index}
                                            whileHover={{ x: 5 }}
                                            className="p-3 border border-gray-100 rounded-lg"
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-medium text-gray-900">{event.name}</p>
                                                <Badge variant="outline" className="text-xs">
                                                    {event.type}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-500">{event.date}</p>
                                        </motion.div>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full mt-4"
                                    onClick={() => navigate('/calendar')}
                                >
                                    View Full Calendar
                                    <Calendar className="h-4 w-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;