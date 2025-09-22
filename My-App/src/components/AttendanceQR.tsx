import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner@2.0.3';
import { 
  QrCode, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Calendar,
  Smartphone,
  Camera
} from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  access_token: string;
}

interface AttendanceQRProps {
  user: User;
}

interface AttendanceRecord {
  id: string;
  date: string;
  time: string;
  subject: string;
  status: 'present' | 'absent' | 'late';
  method: string;
}

export function AttendanceQR({ user }: AttendanceQRProps) {
  const [qrCode, setQrCode] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [manualCode, setManualCode] = useState('');

  useEffect(() => {
    loadAttendanceRecords();
    generateQRCode();
  }, []);

  const generateQRCode = () => {
    // Generate a simple QR code data string
    const qrData = `EDUTRACK_ATTENDANCE:${user.id}:${Date.now()}`;
    setQrCode(qrData);
  };

  const loadAttendanceRecords = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-df276c95/attendance/student/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${user.access_token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAttendanceRecords(data.records || []);
      }
    } catch (error) {
      console.error('Error loading attendance records:', error);
    }
  };

  const markAttendance = async (method: 'qr' | 'manual' = 'qr') => {
    setLoading(true);
    
    try {
      const attendanceData = {
        student_id: user.id,
        method: method,
        code: method === 'manual' ? manualCode : qrCode,
        location: 'Classroom', // Could be detected via GPS
        timestamp: new Date().toISOString()
      };

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-df276c95/attendance/mark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`
        },
        body: JSON.stringify(attendanceData)
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Attendance marked successfully for ${result.subject}!`);
        loadAttendanceRecords();
        setManualCode('');
        generateQRCode();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to mark attendance');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error('Failed to mark attendance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  // Mock attendance records for demo
  const demoRecords: AttendanceRecord[] = [
    { id: '1', date: '2024-01-15', time: '09:00', subject: 'Mathematics', status: 'present', method: 'QR Code' },
    { id: '2', date: '2024-01-15', time: '11:00', subject: 'Physics', status: 'present', method: 'QR Code' },
    { id: '3', date: '2024-01-14', time: '09:00', subject: 'Mathematics', status: 'late', method: 'Manual' },
    { id: '4', date: '2024-01-14', time: '11:00', subject: 'Physics', status: 'present', method: 'QR Code' },
    { id: '5', date: '2024-01-13', time: '13:00', subject: 'Chemistry', status: 'absent', method: 'N/A' }
  ];

  const displayRecords = attendanceRecords.length > 0 ? attendanceRecords : demoRecords;

  return (
    <div className="space-y-6">
      {/* QR Code Attendance */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-blue-600" />
              QR Code Attendance
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {/* QR Code Display */}
            <div className="bg-white p-4 border-2 border-gray-200 rounded-lg inline-block">
              <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded">
                <div className="text-center">
                  <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">QR Code</p>
                  <p className="text-xs text-gray-400 mt-2 break-all">{qrCode.slice(0, 20)}...</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Show this QR code to your teacher or scan the classroom QR code
              </p>
              <Button 
                onClick={() => markAttendance('qr')} 
                disabled={loading}
                className="w-full"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {loading ? 'Marking...' : 'Mark Attendance'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-green-600" />
              Alternative Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Manual Code Entry */}
            <div className="space-y-3">
              <Label htmlFor="manual-code">Enter Attendance Code</Label>
              <Input
                id="manual-code"
                placeholder="Enter code from teacher"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
              />
              <Button 
                onClick={() => markAttendance('manual')} 
                disabled={loading || !manualCode}
                variant="outline"
                className="w-full"
              >
                Submit Code
              </Button>
            </div>

            <div className="border-t pt-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>Location-based attendance coming soon</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Camera className="h-4 w-4" />
                  <span>Face recognition coming soon</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Attendance History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {displayRecords.slice(0, 10).map((record, index) => (
              <div key={record.id || index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium">{record.subject}</p>
                    <p className="text-sm text-gray-600">{record.date} at {record.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(record.status)}>
                    {record.status}
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{record.method}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {displayRecords.length === 0 && (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No attendance records yet</p>
                <p className="text-sm text-gray-400">Start marking your attendance to see records here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}