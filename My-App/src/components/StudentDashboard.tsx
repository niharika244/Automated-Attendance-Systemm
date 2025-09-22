import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Clock, 
  Target, 
  CheckCircle, 
  BookOpen, 
  TrendingUp,
  Calendar,
  QrCode,
  MapPin,
  Award,
  User
} from 'lucide-react';
import { AttendanceQR } from './AttendanceQR';
import { PersonalGoals } from './PersonalGoals';
import { TaskRecommendations } from './TaskRecommendations';
import { ScheduleView } from './ScheduleView';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  access_token: string;
}

interface StudentDashboardProps {
  user: User;
}

interface AttendanceStats {
  present: number;
  total: number;
  percentage: number;
}

interface TodaySchedule {
  time: string;
  subject: string;
  teacher: string;
  room: string;
  type: 'class' | 'free';
}

interface PersonalGoal {
  id: string;
  title: string;
  description: string;
  progress: number;
  deadline: string;
  category: string;
}

export function StudentDashboard({ user }: StudentDashboardProps) {
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats>({
    present: 42,
    total: 50,
    percentage: 84
  });
  
  const [todaySchedule] = useState<TodaySchedule[]>([
    { time: '09:00-10:00', subject: 'Mathematics', teacher: 'Dr. Smith', room: 'Room 101', type: 'class' },
    { time: '10:00-11:00', subject: 'Free Period', teacher: '', room: '', type: 'free' },
    { time: '11:00-12:00', subject: 'Physics', teacher: 'Prof. Johnson', room: 'Lab 202', type: 'class' },
    { time: '12:00-13:00', subject: 'Lunch Break', teacher: '', room: 'Cafeteria', type: 'free' },
    { time: '13:00-14:00', subject: 'Chemistry', teacher: 'Dr. Brown', room: 'Lab 301', type: 'class' }
  ]);

  const [personalGoals] = useState<PersonalGoal[]>([
    {
      id: '1',
      title: 'Master Data Structures',
      description: 'Complete advanced data structures course',
      progress: 65,
      deadline: '2024-03-15',
      category: 'Academic'
    },
    {
      id: '2',
      title: 'Python Certification',
      description: 'Get certified in Python programming',
      progress: 40,
      deadline: '2024-02-28',
      category: 'Skills'
    },
    {
      id: '3',
      title: 'Research Project',
      description: 'Complete AI research project',
      progress: 20,
      deadline: '2024-04-30',
      category: 'Research'
    }
  ]);

  const getCurrentClass = () => {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    for (const schedule of todaySchedule) {
      const [startTime] = schedule.time.split('-');
      const [hours, minutes] = startTime.split(':').map(Number);
      const scheduleTime = hours * 100 + minutes;
      
      if (Math.abs(currentTime - scheduleTime) < 100) {
        return schedule;
      }
    }
    return null;
  };

  const currentClass = getCurrentClass();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h2>
          <p className="text-blue-100 mb-4">Ready to make today productive? Let's check your progress.</p>
          <div className="flex items-center gap-4 text-sm">
            <div className="bg-white/20 px-3 py-1 rounded-full">
              Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
        <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full"></div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Attendance Rate</p>
                <p className="text-3xl font-bold text-green-600">{attendanceStats.percentage}%</p>
                <p className="text-xs text-green-600 mt-1">{attendanceStats.present}/{attendanceStats.total} classes</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Goals Progress</p>
                <p className="text-3xl font-bold text-blue-600">
                  {Math.round(personalGoals.reduce((acc, goal) => acc + goal.progress, 0) / personalGoals.length)}%
                </p>
                <p className="text-xs text-blue-600 mt-1">{personalGoals.length} active goals</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-violet-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 mb-1">Classes Today</p>
                <p className="text-3xl font-bold text-purple-600">
                  {todaySchedule.filter(s => s.type === 'class').length}
                </p>
                <p className="text-xs text-purple-600 mt-1">scheduled</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 mb-1">Achievement Points</p>
                <p className="text-3xl font-bold text-orange-600">1,247</p>
                <p className="text-xs text-orange-600 mt-1">this semester</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Class & Quick Actions */}
      {currentClass && (
        <Card className="border-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-white/20 rounded-lg">
                <Clock className="h-5 w-5" />
              </div>
              Current Class - Live
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{currentClass.subject}</h3>
                <div className="flex items-center gap-4 text-blue-100">
                  <span className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {currentClass.teacher}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {currentClass.room}
                  </span>
                </div>
                <p className="text-sm text-blue-100">{currentClass.time}</p>
              </div>
              <Button className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
                <QrCode className="mr-2 h-4 w-4" />
                Mark Attendance
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-2xl grid-cols-5 bg-white/70 backdrop-blur-sm border border-gray-200/50 p-1 h-12">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm">
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Attendance</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Goals</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Tasks</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Today's Schedule */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {todaySchedule.map((item, index) => (
                  <div key={index} className="group p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-3 h-3 rounded-full ${item.type === 'class' ? 'bg-blue-500' : item.type === 'free' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                          <p className="font-semibold text-gray-900">{item.subject}</p>
                        </div>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">{item.teacher}</p>
                        <p className="text-sm text-gray-500">{item.room}</p>
                      </div>
                      <Badge variant={item.type === 'class' ? 'default' : 'secondary'} className="ml-3">
                        {item.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Personal Goals Summary */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Target className="h-5 w-5 text-purple-600" />
                  </div>
                  Personal Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {personalGoals.slice(0, 3).map((goal) => (
                  <div key={goal.id} className="p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold text-gray-900">{goal.title}</p>
                      <Badge variant="outline" className="border-purple-200 text-purple-700">
                        {goal.category}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-purple-600">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-3" />
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-6 border-purple-200 text-purple-600 hover:bg-purple-50">
                  View All Goals
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance">
          <AttendanceQR user={user} />
        </TabsContent>

        <TabsContent value="schedule">
          <ScheduleView user={user} />
        </TabsContent>

        <TabsContent value="goals">
          <PersonalGoals user={user} goals={personalGoals} />
        </TabsContent>

        <TabsContent value="tasks">
          <TaskRecommendations user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
}