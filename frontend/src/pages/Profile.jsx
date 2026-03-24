// pages/Profile.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    User,
    Mail,
    MapPin,
    Calendar,
    Phone,
    BookOpen,
    Award,
    GraduationCap,
    Save,
    Edit2,
    Loader2,
    CheckCircle,
    XCircle,
    TrendingUp,
    Briefcase,
    Heart
} from "lucide-react";
import { toast } from "react-hot-toast";

const Profile = () => {
    const { user } = useAuth();
    const { updateProfile, updatingProfile } = useUser();
    const navigate = useNavigate();

    const [profileForm, setProfileForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        education: {
            class: user?.education?.class || "",
            stream: user?.education?.stream || "",
            school: user?.education?.school || "",
            percentage: user?.education?.percentage || ""
        },
        address: {
            city: user?.address?.city || "",
            state: user?.address?.state || "",
            country: user?.address?.country || "",
            zipCode: user?.address?.zipCode || ""
        },
        interests: user?.interests || [],
        skills: user?.skills || []
    });

    const [isEditing, setIsEditing] = useState(false);
    const [newInterest, setNewInterest] = useState("");
    const [newSkill, setNewSkill] = useState("");

    const stats = [
        { icon: TrendingUp, label: "Aptitude Score", value: "85%" },
        { icon: BookOpen, label: "Tests Taken", value: "5" },
        { icon: Award, label: "Achievements", value: "3" },
        { icon: Briefcase, label: "Career Matches", value: "4" }
    ];

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(profileForm);
            setIsEditing(false);
        } catch (error) {
        }
    };

    const addInterest = () => {
        if (newInterest && !profileForm.interests.includes(newInterest)) {
            setProfileForm({
                ...profileForm,
                interests: [...profileForm.interests, newInterest]
            });
            setNewInterest("");
            toast.success("Interest added!");
        }
    };

    const removeInterest = (interest) => {
        setProfileForm({
            ...profileForm,
            interests: profileForm.interests.filter(i => i !== interest)
        });
    };

    const addSkill = () => {
        if (newSkill && !profileForm.skills.includes(newSkill)) {
            setProfileForm({
                ...profileForm,
                skills: [...profileForm.skills, newSkill]
            });
            setNewSkill("");
            toast.success("Skill added!");
        }
    };

    const removeSkill = (skill) => {
        setProfileForm({
            ...profileForm,
            skills: profileForm.skills.filter(s => s !== skill)
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/dashboard')}
                        className="mb-4"
                    >
                        ← Back to Dashboard
                    </Button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                My Profile
                            </h1>
                            <p className="text-gray-500 mt-1">Manage your personal information and preferences</p>
                        </div>
                        <Button
                            onClick={() => setIsEditing(!isEditing)}
                            variant={isEditing ? "destructive" : "default"}
                            className={!isEditing ? "bg-gray-900 hover:bg-gray-800" : ""}
                        >
                            {isEditing ? (
                                <>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Cancel
                                </>
                            ) : (
                                <>
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </>
                            )}
                        </Button>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    {stats.map((stat, index) => (
                        <Card key={index} className="border-0 shadow-lg">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">{stat.label}</p>
                                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                    <stat.icon className="h-8 w-8 text-blue-500 opacity-50" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </motion.div>

                {/* Main Profile Content */}
                <Tabs defaultValue="personal" className="space-y-6">
                    <TabsList className="bg-white border shadow-sm">
                        <TabsTrigger value="personal">Personal Info</TabsTrigger>
                        <TabsTrigger value="education">Education</TabsTrigger>
                        <TabsTrigger value="interests">Interests & Skills</TabsTrigger>
                    </TabsList>

                    {/* Personal Info Tab */}
                    <TabsContent value="personal">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Personal Information
                                    </CardTitle>
                                    <CardDescription>Your basic information and contact details</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                                        <div className="flex items-center gap-6 mb-6">
                                            <Avatar className="h-20 w-20">
                                                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl">
                                                    {getInitials(user?.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            {isEditing && (
                                                <Button type="button" variant="outline" size="sm">
                                                    Change Photo
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label>Full Name</Label>
                                                <Input
                                                    value={profileForm.name}
                                                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                                    disabled={!isEditing}
                                                    className={!isEditing ? "bg-gray-50" : ""}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Email Address</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        value={profileForm.email}
                                                        disabled
                                                        className="pl-9 bg-gray-50"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Phone Number</Label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        value={profileForm.phone}
                                                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                                        disabled={!isEditing}
                                                        className={`pl-9 ${!isEditing ? "bg-gray-50" : ""}`}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Date of Birth</Label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        type="date"
                                                        disabled={!isEditing}
                                                        className={`pl-9 ${!isEditing ? "bg-gray-50" : ""}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Address</Label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Input
                                                    placeholder="City"
                                                    value={profileForm.address.city}
                                                    onChange={(e) => setProfileForm({
                                                        ...profileForm,
                                                        address: { ...profileForm.address, city: e.target.value }
                                                    })}
                                                    disabled={!isEditing}
                                                    className={!isEditing ? "bg-gray-50" : ""}
                                                />
                                                <Input
                                                    placeholder="State"
                                                    value={profileForm.address.state}
                                                    onChange={(e) => setProfileForm({
                                                        ...profileForm,
                                                        address: { ...profileForm.address, state: e.target.value }
                                                    })}
                                                    disabled={!isEditing}
                                                    className={!isEditing ? "bg-gray-50" : ""}
                                                />
                                                <Input
                                                    placeholder="Country"
                                                    value={profileForm.address.country}
                                                    onChange={(e) => setProfileForm({
                                                        ...profileForm,
                                                        address: { ...profileForm.address, country: e.target.value }
                                                    })}
                                                    disabled={!isEditing}
                                                    className={!isEditing ? "bg-gray-50" : ""}
                                                />
                                                <Input
                                                    placeholder="Zip Code"
                                                    value={profileForm.address.zipCode}
                                                    onChange={(e) => setProfileForm({
                                                        ...profileForm,
                                                        address: { ...profileForm.address, zipCode: e.target.value }
                                                    })}
                                                    disabled={!isEditing}
                                                    className={!isEditing ? "bg-gray-50" : ""}
                                                />
                                            </div>
                                        </div>

                                        {isEditing && (
                                            <div className="flex justify-end gap-3 pt-4">
                                                <Button
                                                    type="submit"
                                                    disabled={updatingProfile}
                                                    className="bg-gray-900 hover:bg-gray-800"
                                                >
                                                    {updatingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    <Save className="h-4 w-4 mr-2" />
                                                    Save Changes
                                                </Button>
                                            </div>
                                        )}
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </TabsContent>

                    {/* Education Tab */}
                    <TabsContent value="education">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <GraduationCap className="h-5 w-5" />
                                        Education Details
                                    </CardTitle>
                                    <CardDescription>Your academic background</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>Current Class</Label>
                                            <Input
                                                value={profileForm.education.class}
                                                onChange={(e) => setProfileForm({
                                                    ...profileForm,
                                                    education: { ...profileForm.education, class: e.target.value }
                                                })}
                                                disabled={!isEditing}
                                                className={!isEditing ? "bg-gray-50" : ""}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Stream / Subject</Label>
                                            <Input
                                                value={profileForm.education.stream}
                                                onChange={(e) => setProfileForm({
                                                    ...profileForm,
                                                    education: { ...profileForm.education, stream: e.target.value }
                                                })}
                                                disabled={!isEditing}
                                                className={!isEditing ? "bg-gray-50" : ""}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>School/College Name</Label>
                                            <Input
                                                value={profileForm.education.school}
                                                onChange={(e) => setProfileForm({
                                                    ...profileForm,
                                                    education: { ...profileForm.education, school: e.target.value }
                                                })}
                                                disabled={!isEditing}
                                                className={!isEditing ? "bg-gray-50" : ""}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Percentage / CGPA</Label>
                                            <Input
                                                value={profileForm.education.percentage}
                                                onChange={(e) => setProfileForm({
                                                    ...profileForm,
                                                    education: { ...profileForm.education, percentage: e.target.value }
                                                })}
                                                disabled={!isEditing}
                                                className={!isEditing ? "bg-gray-50" : ""}
                                            />
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="flex justify-end gap-3 pt-6">
                                            <Button
                                                onClick={handleUpdateProfile}
                                                disabled={updatingProfile}
                                                className="bg-gray-900 hover:bg-gray-800"
                                            >
                                                {updatingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                <Save className="h-4 w-4 mr-2" />
                                                Save Changes
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </TabsContent>

                    {/* Interests & Skills Tab */}
                    <TabsContent value="interests">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Heart className="h-5 w-5 text-red-500" />
                                        Areas of Interest
                                    </CardTitle>
                                    <CardDescription>Subjects and fields that interest you</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {profileForm.interests.map((interest, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200"
                                            >
                                                {interest}
                                                {isEditing && (
                                                    <button
                                                        onClick={() => removeInterest(interest)}
                                                        className="ml-2 hover:text-red-600"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </Badge>
                                        ))}
                                    </div>
                                    {isEditing && (
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Add an interest (e.g., Mathematics, Physics)"
                                                value={newInterest}
                                                onChange={(e) => setNewInterest(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                                            />
                                            <Button onClick={addInterest} type="button">
                                                Add
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Award className="h-5 w-5 text-green-500" />
                                        Skills & Abilities
                                    </CardTitle>
                                    <CardDescription>Your technical and soft skills</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {profileForm.skills.map((skill, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className="px-3 py-1 text-sm bg-green-100 text-green-700 hover:bg-green-200"
                                            >
                                                {skill}
                                                {isEditing && (
                                                    <button
                                                        onClick={() => removeSkill(skill)}
                                                        className="ml-2 hover:text-red-600"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </Badge>
                                        ))}
                                    </div>
                                    {isEditing && (
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Add a skill (e.g., Programming, Communication)"
                                                value={newSkill}
                                                onChange={(e) => setNewSkill(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                                            />
                                            <Button onClick={addSkill} type="button">
                                                Add
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {isEditing && (
                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleUpdateProfile}
                                        disabled={updatingProfile}
                                        className="bg-gray-900 hover:bg-gray-800"
                                    >
                                        {updatingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        <Save className="h-4 w-4 mr-2" />
                                        Save All Changes
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Profile;