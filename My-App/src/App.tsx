import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ClassroomDisplay } from './components/ClassroomDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { LogOut, Users, Clock, Target, BarChart3, GraduationCap, Monitor, BookOpen, Zap, Shield } from 'lucide-react';
import { Toaster } from './components/ui/sonner';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  access_token: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const savedUser = localStorage.getItem('edutrack_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('edutrack_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('edutrack_user');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700">Loading EduTrack...</p>
          <p className="mt-2 text-sm text-gray-500">Preparing your educational experience</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        <Toaster />
        
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          {/* Hero Section */}
          <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl">
                  <GraduationCap className="h-12 w-12 text-white" />
                </div>
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
                EduTrack
              </h1>
              <p className="text-2xl text-gray-700 max-w-3xl mx-auto mb-4 leading-relaxed">
                Smart Attendance & Student Engagement Platform
              </p>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Revolutionizing education with automated attendance, personalized learning, and real-time insights
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto items-center">
              {/* Features Section */}
              <div className="space-y-8">
                <div className="grid gap-6">
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <Zap className="h-6 w-6 text-blue-600" />
                        </div>
                        Automated Attendance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">
                        Revolutionary QR code-based attendance system with real-time classroom displays. 
                        Eliminate manual roll calls and save precious class time for actual learning.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200 transition-colors">
                          <Target className="h-6 w-6 text-green-600" />
                        </div>
                        Personalized Learning
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">
                        AI-powered task recommendations during free periods based on individual 
                        goals, interests, and career aspirations. Transform idle time into productive learning.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200 transition-colors">
                          <BarChart3 className="h-6 w-6 text-purple-600" />
                        </div>
                        Analytics & Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">
                        Comprehensive analytics dashboard for administrators and teachers to track 
                        student engagement patterns and optimize learning outcomes with data-driven decisions.
                      </p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">99%</div>
                    <div className="text-sm text-gray-600">Accuracy Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">50%</div>
                    <div className="text-sm text-gray-600">Time Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">24/7</div>
                    <div className="text-sm text-gray-600">Support</div>
                  </div>
                </div>
              </div>
              
              {/* Login Section */}
              <div className="flex items-center justify-center">
                <div className="w-full max-w-md">
                  <LoginForm onLogin={handleLogin} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Toaster />
      
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EduTrack
                </h1>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200/50">
                <div className="p-1 bg-white rounded-full">
                  {user.role === 'student' && <BookOpen className="h-3 w-3 text-blue-600" />}
                  {user.role === 'teacher' && <Users className="h-3 w-3 text-green-600" />}
                  {user.role === 'admin' && <Shield className="h-3 w-3 text-purple-600" />}
                </div>
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {user.role}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">Welcome back,</p>
                <p className="text-sm text-gray-600">{user.name}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-lg grid-cols-2 bg-white/70 backdrop-blur-sm border border-gray-200/50 p-1">
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="classroom"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Monitor className="h-4 w-4" />
                Classroom Display
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="dashboard" className="space-y-6">
            {user.role === 'student' && <StudentDashboard user={user} />}
            {user.role === 'teacher' && <TeacherDashboard user={user} />}
            {user.role === 'admin' && <AdminDashboard user={user} />}
          </TabsContent>
          
          <TabsContent value="classroom" className="space-y-6">
            <ClassroomDisplay />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}