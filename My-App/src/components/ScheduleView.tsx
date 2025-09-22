import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User,
  BookOpen,
  Coffee,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  access_token: string;
}

interface ScheduleViewProps {
  user: User;
}

interface ScheduleItem {
  id: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  type: 'class' | 'lab' | 'free' | 'break';
  description?: string;
}

interface DaySchedule {
  date: string;
  day: string;
  items: ScheduleItem[];
}

export function ScheduleView({ user }: ScheduleViewProps) {
  const [selectedWeek, setSelectedWeek] = useState(0); // 0 = current week
  
  // Mock schedule data
  const weekSchedule: DaySchedule[] = [
    {
      date: '2024-01-15',
      day: 'Monday',
      items: [
        { id: '1', time: '09:00-10:00', subject: 'Mathematics', teacher: 'Dr. Smith', room: 'Room 101', type: 'class' },
        { id: '2', time: '10:00-11:00', subject: 'Free Period', teacher: '', room: 'Library', type: 'free', description: 'Study time or personal tasks' },
        { id: '3', time: '11:00-12:00', subject: 'Physics', teacher: 'Prof. Johnson', room: 'Lab 202', type: 'lab' },
        { id: '4', time: '12:00-13:00', subject: 'Lunch Break', teacher: '', room: 'Cafeteria', type: 'break' },
        { id: '5', time: '13:00-14:00', subject: 'Chemistry', teacher: 'Dr. Brown', room: 'Lab 301', type: 'lab' },
        { id: '6', time: '14:00-15:00', subject: 'Free Period', teacher: '', room: 'Study Hall', type: 'free', description: 'Complete chemistry lab report' }
      ]
    },
    {
      date: '2024-01-16',
      day: 'Tuesday',
      items: [
        { id: '7', time: '09:00-10:00', subject: 'Computer Science', teacher: 'Prof. Davis', room: 'CS Lab', type: 'class' },
        { id: '8', time: '10:00-11:00', subject: 'Mathematics', teacher: 'Dr. Smith', room: 'Room 101', type: 'class' },
        { id: '9', time: '11:00-12:00', subject: 'Free Period', teacher: '', room: 'Library', type: 'free', description: 'Work on Python assignment' },
        { id: '10', time: '12:00-13:00', subject: 'Lunch Break', teacher: '', room: 'Cafeteria', type: 'break' },
        { id: '11', time: '13:00-14:00', subject: 'English Literature', teacher: 'Ms. Wilson', room: 'Room 205', type: 'class' },
        { id: '12', time: '14:00-15:00', subject: 'Physics Lab', teacher: 'Prof. Johnson', room: 'Lab 202', type: 'lab' }
      ]
    },
    {
      date: '2024-01-17',
      day: 'Wednesday',
      items: [
        { id: '13', time: '09:00-10:00', subject: 'Chemistry', teacher: 'Dr. Brown', room: 'Room 301', type: 'class' },
        { id: '14', time: '10:00-11:00', subject: 'Free Period', teacher: '', room: 'Study Hall', type: 'free', description: 'Review chemistry notes' },
        { id: '15', time: '11:00-12:00', subject: 'Mathematics', teacher: 'Dr. Smith', room: 'Room 101', type: 'class' },
        { id: '16', time: '12:00-13:00', subject: 'Lunch Break', teacher: '', room: 'Cafeteria', type: 'break' },
        { id: '17', time: '13:00-14:00', subject: 'Computer Science Lab', teacher: 'Prof. Davis', room: 'CS Lab', type: 'lab' },
        { id: '18', time: '14:00-15:00', subject: 'Free Period', teacher: '', room: 'Library', type: 'free', description: 'Career research session' }
      ]
    },
    {
      date: '2024-01-18',
      day: 'Thursday',
      items: [
        { id: '19', time: '09:00-10:00', subject: 'Physics', teacher: 'Prof. Johnson', room: 'Room 202', type: 'class' },
        { id: '20', time: '10:00-11:00', subject: 'English Literature', teacher: 'Ms. Wilson', room: 'Room 205', type: 'class' },
        { id: '21', time: '11:00-12:00', subject: 'Free Period', teacher: '', room: 'Library', type: 'free', description: 'Complete literature essay' },
        { id: '22', time: '12:00-13:00', subject: 'Lunch Break', teacher: '', room: 'Cafeteria', type: 'break' },
        { id: '23', time: '13:00-14:00', subject: 'Mathematics', teacher: 'Dr. Smith', room: 'Room 101', type: 'class' },
        { id: '24', time: '14:00-15:00', subject: 'Chemistry Lab', teacher: 'Dr. Brown', room: 'Lab 301', type: 'lab' }
      ]
    },
    {
      date: '2024-01-19',
      day: 'Friday',
      items: [
        { id: '25', time: '09:00-10:00', subject: 'Computer Science', teacher: 'Prof. Davis', room: 'CS Lab', type: 'class' },
        { id: '26', time: '10:00-11:00', subject: 'Free Period', teacher: '', room: 'Study Hall', type: 'free', description: 'Practice coding problems' },
        { id: '27', time: '11:00-12:00', subject: 'Physics', teacher: 'Prof. Johnson', room: 'Room 202', type: 'class' },
        { id: '28', time: '12:00-13:00', subject: 'Lunch Break', teacher: '', room: 'Cafeteria', type: 'break' },
        { id: '29', time: '13:00-14:00', subject: 'English Literature', teacher: 'Ms. Wilson', room: 'Room 205', type: 'class' },
        { id: '30', time: '14:00-15:00', subject: 'Free Period', teacher: '', room: 'Recreation Center', type: 'free', description: 'Weekly reflection and planning' }
      ]
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'class':
        return <BookOpen className="h-4 w-4" />;
      case 'lab':
        return <BookOpen className="h-4 w-4" />;
      case 'free':
        return <Clock className="h-4 w-4" />;
      case 'break':
        return <Coffee className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'class':
        return 'border-l-blue-500 bg-blue-50';
      case 'lab':
        return 'border-l-green-500 bg-green-50';
      case 'free':
        return 'border-l-purple-500 bg-purple-50';
      case 'break':
        return 'border-l-orange-500 bg-orange-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'class':
        return 'bg-blue-100 text-blue-800';
      case 'lab':
        return 'bg-green-100 text-green-800';
      case 'free':
        return 'bg-purple-100 text-purple-800';
      case 'break':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCurrentTimeSlot = () => {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const today = now.toISOString().split('T')[0];
    
    const todaySchedule = weekSchedule.find(day => day.date === today);
    if (!todaySchedule) return null;

    for (const item of todaySchedule.items) {
      const [startTime] = item.time.split('-');
      const [hours, minutes] = startTime.split(':').map(Number);
      const itemTime = hours * 100 + minutes;
      
      if (Math.abs(currentTime - itemTime) < 100) {
        return item;
      }
    }
    return null;
  };

  const currentTimeSlot = getCurrentTimeSlot();

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Weekly Schedule</h2>
          <p className="text-gray-600">
            Week of January 15-19, 2024 {selectedWeek === 0 && '(Current Week)'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedWeek(selectedWeek - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedWeek(selectedWeek + 1)}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Current Class Highlight */}
      {currentTimeSlot && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                {getTypeIcon(currentTimeSlot.type)}
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Current: {currentTimeSlot.subject}</h3>
                <p className="text-blue-700 text-sm">
                  {currentTimeSlot.teacher} • {currentTimeSlot.room} • {currentTimeSlot.time}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule Tabs */}
      <Tabs defaultValue="week" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="week">Week View</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
        </TabsList>

        <TabsContent value="week" className="space-y-4">
          <div className="grid gap-4">
            {weekSchedule.map((day) => (
              <Card key={day.date}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {day.day}, {new Date(day.date).toLocaleDateString()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {day.items.map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 rounded-lg border-l-4 ${getTypeColor(item.type)} transition-all hover:shadow-md`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            {getTypeIcon(item.type)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{item.subject}</h4>
                                <Badge className={getTypeBadgeColor(item.type)}>
                                  {item.type}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {item.time}
                                </div>
                                {item.teacher && (
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {item.teacher}
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {item.room}
                                </div>
                              </div>
                              {item.description && (
                                <p className="text-sm text-gray-500 mt-1 italic">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="today" className="space-y-4">
          {(() => {
            const today = new Date().toISOString().split('T')[0];
            const todaySchedule = weekSchedule.find(day => day.date === today) || weekSchedule[0];
            
            return (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Today's Schedule - {todaySchedule.day}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {todaySchedule.items.map((item, index) => (
                      <div
                        key={item.id}
                        className={`p-4 rounded-lg border-l-4 ${getTypeColor(item.type)} ${
                          item.id === currentTimeSlot?.id ? 'ring-2 ring-blue-300' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            {getTypeIcon(item.type)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{item.subject}</h4>
                                <Badge className={getTypeBadgeColor(item.type)}>
                                  {item.type}
                                </Badge>
                                {item.id === currentTimeSlot?.id && (
                                  <Badge className="bg-blue-100 text-blue-800">
                                    Current
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {item.time}
                                </div>
                                {item.teacher && (
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {item.teacher}
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {item.room}
                                </div>
                              </div>
                              {item.description && (
                                <p className="text-sm text-gray-500 mt-1 italic">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {item.type === 'free' && (
                            <Button variant="outline" size="sm">
                              View Tasks
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })()}
        </TabsContent>
      </Tabs>
    </div>
  );
}