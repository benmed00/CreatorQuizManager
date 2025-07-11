import { useState, useEffect } from "react";
import { useStore } from "@/store/auth-store";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import UserPerformanceDashboard from "@/components/user-performance-dashboard";
import { useTranslation } from "react-i18next";
import {
  Activity,
  Award,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle,
  Edit,
  Key,
  LogOut,
  Save,
  Shield,
  Target,
  Trophy,
  User,
  BarChart
} from "lucide-react";
import { Leaderboard } from "@shared/schema";

export default function ProfilePage() {
  const { user, logout } = useStore();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || user?.username || "",
    bio: "",
    email: user?.email || "",
    location: "",
    website: "",
  });

  const { data: leaderboard } = useQuery<Leaderboard>({
    queryKey: [`/api/leaderboard/user/${user?.id}`],
    enabled: !!user?.id,
  });

  const { data: achievements } = useQuery<{ id: number; name: string; description: string; date: string }[]>({
    queryKey: [`/api/achievements/user/${user?.id}`],
    enabled: !!user?.id,
  });

  // Handle changes to form inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save profile updates
  const handleSaveProfile = () => {
    // In a real app, you would send these updates to the server
    toast({
      title: t("profile_updated"),
      description: t("profile_updated_description"),
    });
    setIsEditing(false);
  };

  // Determine which tab to show based on URL
  const getActiveTab = () => {
    if (location === '/profile/settings') return 'settings';
    if (location === '/profile/analytics') return 'analytics';
    if (location === '/profile/history') return 'activity';
    return 'profile'; // Default tab
  };

  // Navigate to the appropriate tab URL
  const navigateToTab = (tab: string) => {
    if (tab === 'profile') setLocation('/profile');
    else setLocation(`/profile/${tab === 'activity' ? 'history' : tab}`);
  };

  // Handle user logout
  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  if (!user) {
    setLocation("/login");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left sidebar */}
        <div className="md:col-span-1">
          <Card className="bg-white dark:bg-gray-950 shadow-md overflow-hidden">
            <CardHeader className="p-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20 border-4 border-white/20">
                  <AvatarImage src={user.photoURL || ""} alt={user.displayName || user.username || "User"} />
                  <AvatarFallback className="text-xl bg-primary-700">
                    {user.displayName?.[0] || user.username?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl font-bold">
                    {profileData.displayName}
                  </CardTitle>
                  <CardDescription className="text-primary-100">
                    {leaderboard?.ranking ? `Rank #${leaderboard.ranking}` : "Unranked"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                  Stats
                </h3>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-slate-100 dark:bg-gray-900 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Quizzes Completed</div>
                    <div className="text-2xl font-bold">{leaderboard?.quizzesCompleted || 0}</div>
                  </div>
                  <div className="bg-slate-100 dark:bg-gray-900 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Avg. Score</div>
                    <div className="text-2xl font-bold">{leaderboard?.averageScore || 0}%</div>
                  </div>
                  <div className="bg-slate-100 dark:bg-gray-900 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Score</div>
                    <div className="text-2xl font-bold">{leaderboard?.totalScore || 0}</div>
                  </div>
                  <div className="bg-slate-100 dark:bg-gray-900 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Best Streak</div>
                    <div className="text-2xl font-bold">{leaderboard?.bestStreak || 0}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center">
                  <Award className="h-5 w-5 mr-2 text-purple-500" />
                  Achievements
                </h3>
                <div className="space-y-3 mt-2">
                  {(achievements || [])
                    .slice(0, 3)
                    .map((achievement) => (
                      <div key={achievement.id} className="flex items-start space-x-3 p-3 bg-slate-100 dark:bg-gray-900 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <div className="font-medium">{achievement.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {achievement.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  {(achievements?.length || 0) > 3 && (
                    <Button 
                      variant="link" 
                      className="text-sm px-0" 
                      onClick={() => setLocation('/profile/achievements')}
                    >
                      View all {achievements?.length} achievements
                    </Button>
                  )}
                  {!achievements?.length && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                      No achievements yet. Take more quizzes to earn them!
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="md:col-span-2">
          <Tabs value={getActiveTab()} onValueChange={navigateToTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="profile" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center">
                <BarChart className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Recent
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your profile information and public details
                    </CardDescription>
                  </div>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => {
                      if (isEditing) {
                        handleSaveProfile();
                      } else {
                        setIsEditing(true);
                      }
                    }}
                  >
                    {isEditing ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        name="displayName"
                        value={profileData.displayName}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        placeholder="Tell us about yourself..."
                        value={profileData.bio}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="min-h-[120px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="e.g. San Francisco, CA"
                        value={profileData.location}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        name="website"
                        placeholder="e.g. https://yourwebsite.com"
                        value={profileData.website}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  {/* Account status */}
                  <div className="rounded-lg border p-4 mt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Account Status</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Your account is active and in good standing
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Active
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-indigo-500" />
                    Performance Analytics
                  </CardTitle>
                  <CardDescription>Comprehensive performance statistics and insights</CardDescription>
                </CardHeader>
                <CardContent>
                  {user?.id && (
                    <UserPerformanceDashboard userId={user.id} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-500" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Your latest quizzes and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {/* Recent quizzes */}
                    <div>
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                        Recent Quizzes
                      </h3>
                      <div className="space-y-4">
                        {[
                          {
                            id: 1,
                            title: "Angular Routing Intermediate Quiz",
                            date: "Apr 30, 2024",
                            score: "8/10",
                            category: "Web Development",
                          },
                          {
                            id: 2,
                            title: "JavaScript Fundamentals",
                            date: "Apr 28, 2024",
                            score: "9/10",
                            category: "Programming",
                          },
                        ].map((quiz) => (
                          <div
                            key={quiz.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer"
                          >
                            <div className="flex items-start space-x-3">
                              <div>
                                <div className="font-medium">{quiz.title}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {quiz.date}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className="mb-1">{quiz.category}</Badge>
                              <div className="text-sm font-medium">Score: {quiz.score}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button 
                        variant="link" 
                        className="mt-2 p-0" 
                        onClick={() => setLocation('/profile/history')}
                      >
                        View all activity
                      </Button>
                    </div>

                    {/* Achievement progress */}
                    <div>
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <Target className="h-5 w-5 mr-2 text-indigo-500" />
                        Achievement Progress
                      </h3>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <div className="flex justify-between mb-2">
                            <div className="font-medium">Quiz Master</div>
                            <div className="text-sm font-medium">3/5 quizzes</div>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                            <div
                              className="bg-indigo-500 h-2 rounded-full"
                              style={{ width: "60%" }}
                            ></div>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Complete 5 quizzes to earn this achievement
                          </div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="flex justify-between mb-2">
                            <div className="font-medium">Perfect Score</div>
                            <div className="text-sm font-medium">0/1 quizzes</div>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                            <div
                              className="bg-indigo-500 h-2 rounded-full"
                              style={{ width: "0%" }}
                            ></div>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            Get a perfect score on any quiz
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Email notifications */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium flex items-center">
                          <Bell className="h-5 w-5 mr-2 text-orange-500" />
                          Notifications
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Manage your email notification preferences
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[
                        {
                          id: "quiz-results",
                          label: "Quiz Results",
                          description: "Get notified when quiz results are available",
                        },
                        {
                          id: "new-achievements",
                          label: "New Achievements",
                          description: "Get notified when you earn new achievements",
                        },
                        {
                          id: "leaderboard-updates",
                          label: "Leaderboard Updates",
                          description: "Get notified when leaderboard rankings change",
                        },
                      ].map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-gray-900 rounded-lg"
                        >
                          <div className="flex items-center h-5 mt-1">
                            <input
                              id={item.id}
                              type="checkbox"
                              defaultChecked={item.id === "quiz-results"}
                              className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                          </div>
                          <div className="flex-1">
                            <label
                              htmlFor={item.id}
                              className="block text-sm font-medium"
                            >
                              {item.label}
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security section */}
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium flex items-center">
                      <Key className="h-5 w-5 mr-2 text-red-500" />
                      Security
                    </h3>
                    <div className="mt-4 space-y-4">
                      <Button variant="outline" className="w-full sm:w-auto justify-start">
                        Change Password
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full sm:w-auto justify-start"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Log Out
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-6 flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}