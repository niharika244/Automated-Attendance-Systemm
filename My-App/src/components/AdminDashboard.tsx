import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings,
  School,
  TrendingUp,
  AlertTriangle,
  Calendar,
  UserCheck,
  GraduationCap
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  access_token: string;
}

interface AdminDashboardProps {
  user: User;
}

interface InstituteStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  overallAttendance: number;
  activeClassesToday: number;
}

interface DepartmentData {
  name: string;
  students: number;
  teachers: number;
  attendance: number;
  courses: number;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [instituteStats] = useState<InstituteStats>({
    totalStudents: 1247,
    totalTeachers: 89,
    totalClasses: 156,
    overallAttendance: 87,
    activeClassesToday: 23
  });

  const [departmentData] = useState<DepartmentData[]>([
    { name: 'Computer Science', students: 342, teachers: 18, attendance: 92, courses: 28 },
    { name: 'Mathematics', students: 298, teachers: 15, attendance: 89, courses: 22 },
    { name: 'Physics', students: 267, teachers: 12, attendance: 85, courses: 18 },
    { name: 'Chemistry', students: 234, teachers: 14, attendance: 88, courses: 20 },
    { name: 'Biology', students: 106, teachers: 8, attendance: 86, courses: 12 }
  ]);

  const [recentAlerts] = useState([
    { id: '1', type: 'low_attendance', message: 'Physics Dept: Attendance dropped below 80% threshold', time: '2 hours ago' },
    { id: '2', type: 'system', message: 'Scheduled maintenance tonight at 11 PM', time: '4 hours ago' },
    { id: '3', type: 'achievement', message: 'CS Dept reached 95% attendance milestone', time: '1 day ago' }
  ]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'low_attendance':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'system':
        return <Settings className="h-4 w-4 text-blue-500" />;
      case 'achievement':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Good day, {user.name}!</h2>
          <p className="text-purple-100 mb-4">Here's your institution overview. Everything looks smooth today!</p>
          <div className="flex items-center gap-4 text-sm">
            <div className="bg-white/20 px-3 py-1 rounded-full">
              System Status: All Good
            </div>
            <div className="bg-white/20 px-3 py-1 rounded-full">
              {instituteStats.activeClassesToday} Active Classes
            </div>
          </div>
        </div>
        <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full"></div>
      </div>

      {/* Institute Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-blue-600">{instituteStats.totalStudents.toLocaleString()}</p>
                <p className="text-xs text-blue-600 mt-1">enrolled</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-violet-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 mb-1">Teachers</p>
                <p className="text-3xl font-bold text-purple-600">{instituteStats.totalTeachers}</p>
                <p className="text-xs text-purple-600 mt-1">faculty members</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Total Classes</p>
                <p className="text-3xl font-bold text-green-600">{instituteStats.totalClasses}</p>
                <p className="text-xs text-green-600 mt-1">this semester</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 mb-1">Overall Attendance</p>
                <p className="text-3xl font-bold text-orange-600">{instituteStats.overallAttendance}%</p>
                <p className="text-xs text-orange-600 mt-1">institution average</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition-colors">
                <UserCheck className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-red-50 to-rose-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700 mb-1">Active Classes</p>
                <p className="text-3xl font-bold text-red-600">{instituteStats.activeClassesToday}</p>
                <p className="text-xs text-red-600 mt-1">happening now</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl group-hover:bg-red-200 transition-colors">
                <Calendar className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Recent Alerts & Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center gap-3 p-3 border rounded-lg">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.time}</p>
                </div>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="departments" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="management">User Management</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="space-y-4">
          <div className="grid gap-4">
            {departmentData.map((dept) => (
              <Card key={dept.name}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <School className="h-5 w-5 text-blue-600" />
                        {dept.name} Department
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-gray-600">Students</p>
                          <p className="text-xl font-bold text-blue-600">{dept.students}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Teachers</p>
                          <p className="text-xl font-bold text-purple-600">{dept.teachers}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Courses</p>
                          <p className="text-xl font-bold text-green-600">{dept.courses}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Attendance</p>
                          <p className="text-xl font-bold text-orange-600">{dept.attendance}%</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge 
                        className={
                          dept.attendance >= 90 
                            ? 'bg-green-100 text-green-800' 
                            : dept.attendance >= 80 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {dept.attendance >= 90 ? 'Excellent' : dept.attendance >= 80 ? 'Good' : 'Needs Attention'}
                      </Badge>
                      <div className="mt-3">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Attendance Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Monthly Attendance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['January', 'February', 'March', 'April', 'May'].map((month, index) => {
                    const percentage = 85 + Math.random() * 10;
                    return (
                      <div key={month} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{month}</span>
                          <span className="text-sm text-gray-600">{Math.round(percentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Department Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Department Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentData.slice(0, 5).map((dept) => (
                    <div key={dept.name} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{dept.name}</span>
                        <span className="text-sm text-gray-600">{dept.attendance}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            dept.attendance >= 90 ? 'bg-green-600' : 
                            dept.attendance >= 80 ? 'bg-yellow-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${dept.attendance}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Student Engagement */}
            <Card>
              <CardHeader>
                <CardTitle>Student Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">78%</p>
                    <p className="text-sm text-gray-600">Active Goal Setting</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">92%</p>
                    <p className="text-sm text-gray-600">Task Completion</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">1,247</p>
                    <p className="text-sm text-gray-600">Total Tasks Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">4.7</p>
                    <p className="text-sm text-gray-600">Avg. Student Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Usage */}
            <Card>
              <CardHeader>
                <CardTitle>System Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Daily Active Users</span>
                    <span className="font-semibold">1,156 / 1,336</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full w-[86%]"></div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm">QR Code Usage</span>
                    <span className="font-semibold">89%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-[89%]"></div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm">Mobile App Usage</span>
                    <span className="font-semibold">73%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full w-[73%]"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="management" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input placeholder="Search users..." className="flex-1" />
                  <Button>Search</Button>
                </div>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Students
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Manage Teachers
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Admin Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Add New Student
                </Button>
                <Button className="w-full justify-start">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Add New Teacher
                </Button>
                <Button className="w-full justify-start">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Create New Course
                </Button>
                <Button className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Management
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Automatic Attendance</span>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">QR Code Generation</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Real-time Sync</span>
                    <Badge className="bg-green-100 text-green-800">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Backup Status</span>
                    <Badge className="bg-blue-100 text-blue-800">Last: 2h ago</Badge>
                  </div>
                </div>
                
                <Button className="w-full mt-4">
                  <Settings className="mr-2 h-4 w-4" />
                  Advanced Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Server Performance</span>
                      <span className="text-sm text-green-600">Excellent</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full w-[95%]"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Database Health</span>
                      <span className="text-sm text-green-600">Good</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full w-[88%]"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Network Latency</span>
                      <span className="text-sm text-yellow-600">Fair</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full w-[72%]"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}