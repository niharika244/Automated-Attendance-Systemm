import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  BookOpen, 
  Target, 
  Clock, 
  Star,
  Play,
  CheckCircle,
  TrendingUp,
  Brain,
  Code,
  FlaskConical
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

interface TaskRecommendationsProps {
  user: User;
}

interface RecommendedTask {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: number; // minutes
  points: number;
  skills: string[];
  status: 'available' | 'in_progress' | 'completed';
  progress: number;
  relevanceScore: number;
}

interface CompletedTask {
  id: string;
  title: string;
  completedAt: string;
  pointsEarned: number;
  category: string;
}

export function TaskRecommendations({ user }: TaskRecommendationsProps) {
  const [recommendedTasks, setRecommendedTasks] = useState<RecommendedTask[]>([]);
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('recommended');

  useEffect(() => {
    loadRecommendedTasks();
    loadCompletedTasks();
  }, []);

  const loadRecommendedTasks = async () => {
    try {
      // For demo purposes, using mock data
      // In real implementation, this would fetch from the server
      const mockTasks: RecommendedTask[] = [
        {
          id: '1',
          title: 'Practice Linear Algebra Problems',
          description: 'Solve 10 matrix multiplication problems to strengthen your mathematical foundation',
          category: 'Mathematics',
          difficulty: 'Medium',
          estimatedTime: 45,
          points: 120,
          skills: ['Linear Algebra', 'Problem Solving'],
          status: 'available',
          progress: 0,
          relevanceScore: 95
        },
        {
          id: '2',
          title: 'Python Data Structures Tutorial',
          description: 'Complete an interactive tutorial on lists, dictionaries, and sets',
          category: 'Programming',
          difficulty: 'Easy',
          estimatedTime: 30,
          points: 80,
          skills: ['Python', 'Data Structures'],
          status: 'available',
          progress: 0,
          relevanceScore: 90
        },
        {
          id: '3',
          title: 'Physics Lab Report Review',
          description: 'Review and analyze your recent physics lab experiment results',
          category: 'Physics',
          difficulty: 'Medium',
          estimatedTime: 60,
          points: 150,
          skills: ['Lab Analysis', 'Scientific Writing'],
          status: 'in_progress',
          progress: 40,
          relevanceScore: 85
        },
        {
          id: '4',
          title: 'Career Research: AI Engineer',
          description: 'Research career paths in artificial intelligence and create a development plan',
          category: 'Career Planning',
          difficulty: 'Easy',
          estimatedTime: 25,
          points: 100,
          skills: ['Research', 'Career Planning'],
          status: 'available',
          progress: 0,
          relevanceScore: 80
        },
        {
          id: '5',
          title: 'Chemistry Equation Balancing',
          description: 'Practice balancing chemical equations with increasing difficulty',
          category: 'Chemistry',
          difficulty: 'Hard',
          estimatedTime: 50,
          points: 180,
          skills: ['Chemistry', 'Problem Solving'],
          status: 'available',
          progress: 0,
          relevanceScore: 75
        }
      ];
      
      setRecommendedTasks(mockTasks);
    } catch (error) {
      console.error('Error loading recommended tasks:', error);
      toast.error('Failed to load recommended tasks');
    }
  };

  const loadCompletedTasks = async () => {
    try {
      const mockCompletedTasks: CompletedTask[] = [
        {
          id: '1',
          title: 'Calculus Integration Practice',
          completedAt: '2024-01-14T10:30:00Z',
          pointsEarned: 150,
          category: 'Mathematics'
        },
        {
          id: '2',
          title: 'Python Basics Quiz',
          completedAt: '2024-01-13T14:15:00Z',
          pointsEarned: 100,
          category: 'Programming'
        },
        {
          id: '3',
          title: 'Study Plan Creation',
          completedAt: '2024-01-12T16:45:00Z',
          pointsEarned: 80,
          category: 'Study Skills'
        }
      ];
      
      setCompletedTasks(mockCompletedTasks);
    } catch (error) {
      console.error('Error loading completed tasks:', error);
    }
  };

  const startTask = async (taskId: string) => {
    setLoading(true);
    
    try {
      // Update task status to in_progress
      setRecommendedTasks(tasks => 
        tasks.map(task => 
          task.id === taskId 
            ? { ...task, status: 'in_progress' as const }
            : task
        )
      );
      
      toast.success('Task started! Good luck!');
    } catch (error) {
      console.error('Error starting task:', error);
      toast.error('Failed to start task');
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId: string) => {
    setLoading(true);
    
    try {
      const task = recommendedTasks.find(t => t.id === taskId);
      if (!task) return;

      // Move task to completed
      const completedTask: CompletedTask = {
        id: taskId,
        title: task.title,
        completedAt: new Date().toISOString(),
        pointsEarned: task.points,
        category: task.category
      };
      
      setCompletedTasks(prev => [completedTask, ...prev]);
      setRecommendedTasks(tasks => 
        tasks.map(t => 
          t.id === taskId 
            ? { ...t, status: 'completed' as const, progress: 100 }
            : t
        )
      );
      
      toast.success(`Congratulations! You earned ${task.points} points!`);
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Mathematics':
        return <Target className="h-4 w-4" />;
      case 'Programming':
        return <Code className="h-4 w-4" />;
      case 'Physics':
      case 'Chemistry':
        return <FlaskConical className="h-4 w-4" />;
      case 'Career Planning':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Tasks</p>
                <p className="text-2xl font-bold text-blue-600">
                  {recommendedTasks.filter(t => t.status === 'available').length}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-orange-600">
                  {recommendedTasks.filter(t => t.status === 'in_progress').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedTasks.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="recommended" className="space-y-4">
          <div className="grid gap-4">
            {recommendedTasks.filter(t => t.status === 'available').map((task) => (
              <Card key={task.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getCategoryIcon(task.category)}
                        <h3 className="font-semibold">{task.title}</h3>
                        <Badge className={getDifficultyColor(task.difficulty)}>
                          {task.difficulty}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{task.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {task.estimatedTime} min
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          {task.points} points
                        </div>
                        <Badge variant="outline">{task.category}</Badge>
                      </div>
                      
                      <div className="flex gap-1 mb-4">
                        {task.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <div className="text-right mb-2">
                        <div className="flex items-center gap-1 text-sm">
                          <Brain className="h-4 w-4 text-purple-600" />
                          <span className="text-purple-600 font-medium">
                            {task.relevanceScore}% match
                          </span>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => startTask(task.id)}
                        disabled={loading}
                        className="flex items-center gap-2"
                      >
                        <Play className="h-4 w-4" />
                        Start Task
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="in_progress" className="space-y-4">
          <div className="grid gap-4">
            {recommendedTasks.filter(t => t.status === 'in_progress').map((task) => (
              <Card key={task.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getCategoryIcon(task.category)}
                        <h3 className="font-semibold">{task.title}</h3>
                        <Badge variant="outline" className="bg-orange-100 text-orange-800">
                          In Progress
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{task.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="ml-4 space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        Continue
                      </Button>
                      <Button
                        onClick={() => completeTask(task.id)}
                        disabled={loading}
                        size="sm"
                        className="w-full"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Complete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {recommendedTasks.filter(t => t.status === 'in_progress').length === 0 && (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No tasks in progress</p>
              <p className="text-sm text-gray-400">Start a task from the recommended list</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-3">
            {completedTasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <h3 className="font-medium">{task.title}</h3>
                        <p className="text-sm text-gray-600">
                          Completed {new Date(task.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-green-600">
                        <Star className="h-4 w-4" />
                        <span className="font-medium">+{task.pointsEarned}</span>
                      </div>
                      <Badge variant="outline">{task.category}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {completedTasks.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No completed tasks yet</p>
              <p className="text-sm text-gray-400">Complete tasks to see them here</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}