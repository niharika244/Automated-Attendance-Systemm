import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  BookOpen, 
  QrCode,
  Calendar,
  BarChart3,
  UserCheck,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  access_token: string;
}

interface TeacherDashboardProps {
  user: User;
}

interface ClassSession {
  id: string;
  subject: string;
  room: string;
  time: string;
  date: string;
  studentsEnrolled: number;
  studentsPresent: number;
  attendanceCode?: string;
}

interface StudentAttendance {
  id: string;
  name: string;
  studentId: string;
  status: 'present' | 'absent' | 'late';
  timestamp?: string;
  method?: string;
}

export function TeacherDashboard({ user }: TeacherDashboardProps) {
  const [todayClasses, setTodayClasses] = useState<ClassSession[]>([]);
  const [currentClass, setCurrentClass] = useState<ClassSession | null>(null);
  const [attendanceList, setAttendanceList] = useState<StudentAttendance[]>([]);
  const [attendanceCode, setAttendanceCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTodayClasses();
    loadCurrentClass();
  }, []);

  const loadTodayClasses = () => {
    // Mock data for today's classes
    const mockClasses: ClassSession[] = [
      {
        id: '1',
        subject: 'Mathematics - Calculus',
        room: 'Room 101',
        time: '09:00-10:00',
        date: '2024-01-15',
        studentsEnrolled: 28,
        studentsPresent: 25,
        attendanceCode: 'MATH101'
      },
      {
        id: '2',
        subject: 'Mathematics - Linear Algebra',
        room: 'Room 101',
        time: '11:00-12:00',
        date: '2024-01-15',
        studentsEnrolled: 32,
        studentsPresent: 30
      },
      {
        id: '3',
        subject: 'Mathematics - Statistics',
        room: 'Room 105',
        time: '14:00-15:00',
        date: '2024-01-15',
        studentsEnrolled: 25,
        studentsPresent: 0
      }
    ];
    
    setTodayClasses(mockClasses);
  };

  const loadCurrentClass = () => {
    // Determine current class based on time
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    // For demo, assume first class is current
    if (todayClasses.length > 0) {
      setCurrentClass(todayClasses[0]);
      loadAttendanceForClass(todayClasses[0].id);
    }
  };

  const loadAttendanceForClass = (classId: string) => {
    // Mock attendance data
    const mockAttendance: StudentAttendance[] = [
      { id: '1', name: 'Alex Johnson', studentId: 'ST2024001', status: 'present', timestamp: '09:02', method: 'QR Code' },
      { id: '2', name: 'Sarah Wilson', studentId: 'ST2024002', status: 'present', timestamp: '09:01', method: 'QR Code' },
      { id: '3', name: 'Mike Chen', studentId: 'ST2024003', status: 'late', timestamp: '09:15', method: 'Manual' },
      { id: '4', name: 'Emily Davis', studentId: 'ST2024004', status: 'present', timestamp: '08:58', method: 'QR Code' },
      { id: '5', name: 'David Brown', studentId: 'ST2024005', status: 'absent' },
      { id: '6', name: 'Lisa Garcia', studentId: 'ST2024006', status: 'present', timestamp: '09:03', method: 'QR Code' },
      { id: '7', name: 'Tom Anderson', studentId: 'ST2024007', status: 'present', timestamp: '09:00', method: 'QR Code' },
      { id: '8', name: 'Anna Martinez', studentId: 'ST2024008', status: 'late', timestamp: '09:12', method: 'Manual' }
    ];
    
    setAttendanceList(mockAttendance);
  };

  const generateAttendanceCode = () => {
    const codes = ['MATH101', 'CALC01', 'STUDY1', 'LEARN1', 'CLASS1'];
    const randomCode = codes[Math.floor(Math.random() * codes.length)] + Math.floor(Math.random() * 100);
    setAttendanceCode(randomCode);
    
    if (currentClass) {
      setCurrentClass({
        ...currentClass,
        attendanceCode: randomCode
      });
    }
    
    toast.success('New attendance code generated!');
  };

  const markStudentAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceList(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { 
              ...student, 
              status, 
              timestamp: status !== 'absent' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
              method: 'Manual'
            }
          : student
      )
    );
  };

  const getAttendanceStats = () => {
    const total = attendanceList.length;
    const present = attendanceList.filter(s => s.status === 'present').length;
    const late = attendanceList.filter(s => s.status === 'late').length;
    const absent = attendanceList.filter(s => s.status === 'absent').length;
    
    return { total, present, late, absent, percentage: Math.round(((present + late) / total) * 100) };
  };

  const stats = getAttendanceStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Good morning, {user.name}!</h2>
          <p className="text-green-100 mb-4">You have {todayClasses.length} classes scheduled today. Ready to inspire minds?</p>
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
        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Today's Classes</p>
                <p className="text-3xl font-bold text-blue-600">{todayClasses.length}</p>
                <p className="text-xs text-blue-600 mt-1">scheduled</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-violet-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 mb-1">Total Students</p>
                <p className="text-3xl font-bold text-purple-600">
                  {todayClasses.reduce((acc, cls) => acc + cls.studentsEnrolled, 0)}
                </p>
                <p className="text-xs text-purple-600 mt-1">enrolled</p>
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
                <p className="text-sm font-medium text-green-700 mb-1">Current Attendance</p>
                <p className="text-3xl font-bold text-green-600">{stats.percentage}%</p>
                <p className="text-xs text-green-600 mt-1">{stats.present + stats.late} of {stats.total}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-red-50 to-rose-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700 mb-1">Absent Today</p>
                <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
                <p className="text-xs text-red-600 mt-1">students</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl group-hover:bg-red-200 transition-colors">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Class */}
      {currentClass && (
        <Card className="border-0 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-white/20 rounded-lg">
                <BookOpen className="h-5 w-5" />
              </div>
              Current Class - Live Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-bold">{currentClass.subject}</h3>
                  <p className="text-emerald-100">{currentClass.room} • {currentClass.time}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-emerald-100">
                  <span className="bg-white/20 px-3 py-1 rounded-full">
                    {currentClass.studentsPresent} / {currentClass.studentsEnrolled} present
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full">
                    {Math.round((currentClass.studentsPresent / currentClass.studentsEnrolled) * 100)}% attendance
                  </span>
                </div>
              </div>
              <div className="text-right space-y-3">
                {currentClass.attendanceCode && (
                  <div className="bg-white p-4 rounded-xl border shadow-sm">
                    <p className="text-xs text-gray-600 mb-1">Attendance Code</p>
                    <p className="text-2xl font-bold text-emerald-600">{currentClass.attendanceCode}</p>
                  </div>
                )}
                <Button onClick={generateAttendanceCode} className="bg-white text-emerald-600 hover:bg-emerald-50 shadow-lg">
                  <QrCode className="mr-2 h-4 w-4" />
                  Generate New Code
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dashboard Tabs */}
      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="attendance">Live Attendance</TabsTrigger>
          <TabsTrigger value="classes">Today's Classes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="students">Student Management</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-4">
          {currentClass && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Live Attendance - {currentClass.subject}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">
                      {stats.present} Present
                    </Badge>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {stats.late} Late
                    </Badge>
                    <Badge className="bg-red-100 text-red-800">
                      {stats.absent} Absent
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {attendanceList.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.studentId}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {student.timestamp && (
                          <div className="text-right text-sm text-gray-500">
                            <p>{student.timestamp}</p>
                            <p>{student.method}</p>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={student.status === 'present' ? 'default' : 'outline'}
                            onClick={() => markStudentAttendance(student.id, 'present')}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Present
                          </Button>
                          <Button
                            size="sm"
                            variant={student.status === 'late' ? 'default' : 'outline'}
                            onClick={() => markStudentAttendance(student.id, 'late')}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white"
                          >
                            Late
                          </Button>
                          <Button
                            size="sm"
                            variant={student.status === 'absent' ? 'default' : 'outline'}
                            onClick={() => markStudentAttendance(student.id, 'absent')}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Absent
                          </Button>
                        </div>
                        
                        <Badge className={getStatusColor(student.status)}>
                          {student.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <div className="grid gap-4">
            {todayClasses.map((classSession) => (
              <Card key={classSession.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{classSession.subject}</h3>
                      <p className="text-gray-600">{classSession.room} • {classSession.time}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {classSession.studentsEnrolled} enrolled
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-600">
                            {classSession.studentsPresent} present
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        {Math.round((classSession.studentsPresent / classSession.studentsEnrolled) * 100)}%
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setCurrentClass(classSession);
                          loadAttendanceForClass(classSession.id);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Weekly Attendance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => {
                    const percentage = 85 + Math.random() * 10;
                    return (
                      <div key={day} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{day}</span>
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
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Subject Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { subject: 'Calculus', attendance: 92 },
                    { subject: 'Linear Algebra', attendance: 88 },
                    { subject: 'Statistics', attendance: 85 }
                  ].map((item) => (
                    <div key={item.subject} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{item.subject}</span>
                        <span className="text-sm text-gray-600">{item.attendance}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${item.attendance}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Student management features</p>
                <p className="text-sm text-gray-400">View student profiles, performance, and engagement metrics</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}