import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Target, 
  Plus, 
  Calendar, 
  TrendingUp,
  Edit,
  Trash2,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  access_token: string;
}

interface PersonalGoal {
  id: string;
  title: string;
  description: string;
  progress: number;
  deadline: string;
  category: string;
}

interface PersonalGoalsProps {
  user: User;
  goals: PersonalGoal[];
}

export function PersonalGoals({ user, goals: initialGoals }: PersonalGoalsProps) {
  const [goals, setGoals] = useState<PersonalGoal[]>(initialGoals);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    deadline: '',
    category: 'Academic'
  });

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.description || !newGoal.deadline) {
      toast.error('Please fill in all fields');
      return;
    }

    const goal: PersonalGoal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      progress: 0,
      deadline: newGoal.deadline,
      category: newGoal.category
    };

    setGoals(prev => [...prev, goal]);
    setNewGoal({ title: '', description: '', deadline: '', category: 'Academic' });
    setShowAddDialog(false);
    toast.success('Goal added successfully!');
  };

  const updateGoalProgress = (goalId: string, newProgress: number) => {
    setGoals(prev => 
      prev.map(goal => 
        goal.id === goalId 
          ? { ...goal, progress: Math.max(0, Math.min(100, newProgress)) }
          : goal
      )
    );
    
    if (newProgress >= 100) {
      toast.success('Congratulations! Goal completed! 🎉');
    }
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
    toast.success('Goal deleted');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Academic':
        return 'bg-blue-100 text-blue-800';
      case 'Skills':
        return 'bg-purple-100 text-purple-800';
      case 'Research':
        return 'bg-green-100 text-green-800';
      case 'Career':
        return 'bg-orange-100 text-orange-800';
      case 'Personal':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeadlineStatus = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: 'overdue', color: 'text-red-600', text: `${Math.abs(diffDays)} days overdue` };
    } else if (diffDays === 0) {
      return { status: 'today', color: 'text-orange-600', text: 'Due today' };
    } else if (diffDays <= 7) {
      return { status: 'upcoming', color: 'text-orange-600', text: `${diffDays} days left` };
    } else {
      return { status: 'future', color: 'text-gray-600', text: `${diffDays} days left` };
    }
  };

  const completedGoals = goals.filter(goal => goal.progress >= 100);
  const activeGoals = goals.filter(goal => goal.progress < 100);
  const averageProgress = goals.length > 0 
    ? Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Goals</p>
                <p className="text-2xl font-bold text-blue-600">{goals.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Goals</p>
                <p className="text-2xl font-bold text-orange-600">{activeGoals.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedGoals.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Progress</p>
                <p className="text-2xl font-bold text-purple-600">{averageProgress}%</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-sm font-bold text-purple-600">{averageProgress}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Goal */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Personal Goals</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal-title">Goal Title</Label>
                <Input
                  id="goal-title"
                  placeholder="Enter your goal title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="goal-description">Description</Label>
                <Textarea
                  id="goal-description"
                  placeholder="Describe your goal in detail"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="goal-category">Category</Label>
                  <Select value={newGoal.category} onValueChange={(value) => setNewGoal(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Academic">Academic</SelectItem>
                      <SelectItem value="Skills">Skills</SelectItem>
                      <SelectItem value="Research">Research</SelectItem>
                      <SelectItem value="Career">Career</SelectItem>
                      <SelectItem value="Personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="goal-deadline">Deadline</Label>
                  <Input
                    id="goal-deadline"
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddGoal}>
                  Add Goal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Goals List */}
      <div className="grid gap-4">
        {goals.map((goal) => {
          const deadlineInfo = getDeadlineStatus(goal.deadline);
          
          return (
            <Card key={goal.id} className={goal.progress >= 100 ? 'border-green-200 bg-green-50' : ''}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{goal.title}</h3>
                      <Badge className={getCategoryColor(goal.category)}>
                        {goal.category}
                      </Badge>
                      {goal.progress >= 100 && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{goal.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span className={deadlineInfo.color}>
                          {new Date(goal.deadline).toLocaleDateString()} • {deadlineInfo.text}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Progress Section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-gray-600">{goal.progress}%</span>
                  </div>
                  
                  <Progress value={goal.progress} className="h-3" />
                  
                  {goal.progress < 100 && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateGoalProgress(goal.id, goal.progress + 10)}
                      >
                        +10%
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateGoalProgress(goal.id, goal.progress + 25)}
                      >
                        +25%
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateGoalProgress(goal.id, 100)}
                      >
                        Complete
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {goals.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No goals set yet</p>
            <p className="text-sm text-gray-400 mb-4">Start by adding your first personal goal</p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Goal
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}