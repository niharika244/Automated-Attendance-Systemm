import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  QrCode,
  Calendar,
  BookOpen,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

interface AttendanceData {
  subject: string;
  teacher: string;
  room: string;
  time: string;
  totalStudents: number;
  presentStudents: number;
  lateStudents: number;
  absentStudents: number;
  attendanceCode: string;
}

interface RecentAttendance {
  id: string;
  studentName: string;
  time: string;
  method: string;
  status: 'present' | 'late';
}

export function ClassroomDisplay() {
  const [currentClass, setCurrentClass] = useState<AttendanceData | null>(null);
  const [recentAttendance, setRecentAttendance] = useState<RecentAttendance[]>([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    // Load initial data
    loadClassroomData();
    
    // Set up auto-refresh if enabled
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadClassroomData();
      }, 5000); // Refresh every 5 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadClassroomData = () => {
    // Mock current class data
    const mockClassData: AttendanceData = {
      subject: 'Mathematics - Calculus',
      teacher: 'Dr. Smith',
      room: 'Room 101',
      time: '09:00 - 10:00',
      totalStudents: 28,
      presentStudents: 23,
      lateStudents: 2,
      absentStudents: 3,
      attendanceCode: 'MATH101'
    };

    // Mock recent attendance
    const mockRecentAttendance: RecentAttendance[] = [
      { id: '1', studentName: 'Alex Johnson', time: '09:02', method: 'QR Code', status: 'present' },
      { id: '2', studentName: 'Sarah Wilson', time: '09:01', method: 'QR Code', status: 'present' },
      { id: '3', studentName: 'Mike Chen', time: '09:15', method: 'Manual', status: 'late' },
      { id: '4', studentName: 'Emily Davis', time: '08:58', method: 'QR Code', status: 'present' },
      { id: '5', studentName: 'Lisa Garcia', time: '09:03', method: 'QR Code', status: 'present' }
    ];

    setCurrentClass(mockClassData);
    setRecentAttendance(mockRecentAttendance);
    setLastUpdated(new Date());
  };

  const getAttendancePercentage = () => {
    if (!currentClass) return 0;
    return Math.round(((currentClass.presentStudents + currentClass.lateStudents) / currentClass.totalStudents) * 100);
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  if (!currentClass) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl">
        <div className="text-center p-12">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md mx-auto">
            <div className="bg-gray-100 p-6 rounded-full w-fit mx-auto mb-6">
              <BookOpen className="h-16 w-16 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No Active Class</h2>
            <p className="text-gray-600 leading-relaxed">
              The classroom display will automatically show live attendance data when a class session begins.
            </p>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                Teachers can start attendance tracking from their dashboard
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const attendancePercentage = getAttendancePercentage();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{currentClass.room} - Live Attendance</h1>
              <p className="text-indigo-100">Last updated: {formatTime(lastUpdated)}</p>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-indigo-100">Live updates active</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`border-white/30 text-white hover:bg-white/20 ${autoRefresh ? 'bg-white/20' : ''}`}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                Auto Refresh: {autoRefresh ? 'ON' : 'OFF'}
              </Button>
              
              <Button onClick={loadClassroomData} className="bg-white text-indigo-600 hover:bg-gray-100">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Now
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full"></div>
      </div>

      {/* Current Class Info */}
      <Card className="border-0 bg-white/95 backdrop-blur-sm shadow-xl">
        <CardContent className="p-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentClass.subject}</h2>
                <p className="text-lg text-gray-600">Live Session in Progress</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-gray-700">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{currentClass.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Teacher</p>
                    <p className="font-medium">{currentClass.teacher}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-2xl text-white shadow-2xl">
                <h3 className="text-lg font-medium mb-4">Attendance Code</h3>
                <div className="text-5xl font-bold mb-4 tracking-wider">{currentClass.attendanceCode}</div>
                <div className="flex items-center justify-center gap-2 text-blue-100">
                  <QrCode className="h-5 w-5" />
                  <span>Scan QR or Enter Code</span>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-sm text-blue-100">Students can mark attendance using this code</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-8 text-center">
            <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
              <Users className="h-10 w-10 text-blue-600" />
            </div>
            <div className="text-4xl font-bold text-blue-600 mb-2">{currentClass.totalStudents}</div>
            <div className="text-sm font-medium text-blue-700">Total Students</div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-8 text-center">
            <div className="p-4 bg-green-100 rounded-full w-fit mx-auto mb-4 group-hover:bg-green-200 transition-colors">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <div className="text-4xl font-bold text-green-600 mb-2">{currentClass.presentStudents}</div>
            <div className="text-sm font-medium text-green-700">Present</div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-yellow-50 to-amber-50">
          <CardContent className="p-8 text-center">
            <div className="p-4 bg-yellow-100 rounded-full w-fit mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
              <Clock className="h-10 w-10 text-yellow-600" />
            </div>
            <div className="text-4xl font-bold text-yellow-600 mb-2">{currentClass.lateStudents}</div>
            <div className="text-sm font-medium text-yellow-700">Late</div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-red-50 to-rose-50">
          <CardContent className="p-8 text-center">
            <div className="p-4 bg-red-100 rounded-full w-fit mx-auto mb-4 group-hover:bg-red-200 transition-colors">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <div className="text-4xl font-bold text-red-600 mb-2">{currentClass.absentStudents}</div>
            <div className="text-sm font-medium text-red-700">Absent</div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Percentage */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Overall Attendance</h3>
            <div className={`text-6xl font-bold mb-4 ${getStatusColor(attendancePercentage)}`}>
              {attendancePercentage}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div 
                className={`h-4 rounded-full transition-all duration-500 ${
                  attendancePercentage >= 90 ? 'bg-green-600' : 
                  attendancePercentage >= 80 ? 'bg-yellow-600' : 'bg-red-600'
                }`}
                style={{ width: `${attendancePercentage}%` }}
              ></div>
            </div>
            <Badge 
              className={
                attendancePercentage >= 90 ? 'bg-green-100 text-green-800 text-lg px-4 py-2' :
                attendancePercentage >= 80 ? 'bg-yellow-100 text-yellow-800 text-lg px-4 py-2' :
                'bg-red-100 text-red-800 text-lg px-4 py-2'
              }
            >
              {attendancePercentage >= 90 ? 'Excellent Attendance' : 
               attendancePercentage >= 80 ? 'Good Attendance' : 'Poor Attendance'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Recent Attendance Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Attendance Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentAttendance.length > 0 ? (
            <div className="space-y-3">
              {recentAttendance.map((attendance) => (
                <div 
                  key={attendance.id} 
                  className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      attendance.status === 'present' ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      {attendance.status === 'present' ? 
                        <CheckCircle className="h-5 w-5 text-green-600" /> :
                        <Clock className="h-5 w-5 text-yellow-600" />
                      }
                    </div>
                    <div>
                      <p className="font-medium">{attendance.studentName}</p>
                      <p className="text-sm text-gray-600">
                        Marked at {attendance.time} via {attendance.method}
                      </p>
                    </div>
                  </div>
                  
                  <Badge className={
                    attendance.status === 'present' ? 
                      'bg-green-100 text-green-800' : 
                      'bg-yellow-100 text-yellow-800'
                  }>
                    {attendance.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No attendance activity yet</p>
              <p className="text-sm text-gray-400">Students' attendance will appear here as they check in</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}