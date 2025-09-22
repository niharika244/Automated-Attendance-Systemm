import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';
import { Loader2, UserCheck } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  access_token: string;
}

interface LoginFormProps {
  onLogin: (user: User) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up new user
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-df276c95/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            email,
            password,
            name,
            role
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Sign up failed');
        }

        toast.success('Account created successfully! Please sign in.');
        setIsSignUp(false);
        setName('');
        setEmail('');
        setPassword('');
      } else {
        // Sign in existing user
        const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-df276c95/signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            email,
            password
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Sign in failed');
        }

        onLogin({
          id: data.user.id,
          name: data.user.user_metadata?.name || data.user.email,
          email: data.user.email,
          role: data.user.user_metadata?.role || 'student',
          access_token: data.session.access_token
        });

        toast.success('Welcome to EduTrack!');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoRole: 'student' | 'teacher' | 'admin') => {
    const demoUsers = {
      student: {
        id: 'demo-student-1',
        name: 'Alex Student',
        email: 'alex.student@edutrack.demo',
        role: 'student' as const,
        access_token: 'demo-token'
      },
      teacher: {
        id: 'demo-teacher-1',
        name: 'Prof. Sarah Johnson',
        email: 'sarah.johnson@edutrack.demo',
        role: 'teacher' as const,
        access_token: 'demo-token'
      },
      admin: {
        id: 'demo-admin-1',
        name: 'Dr. Michael Admin',
        email: 'michael.admin@edutrack.demo',
        role: 'admin' as const,
        access_token: 'demo-token'
      }
    };

    onLogin(demoUsers[demoRole]);
    toast.success(`Logged in as ${demoRole} (Demo Mode)`);
  };

  return (
    <Card className="w-full max-w-md border-0 bg-white/95 backdrop-blur-sm shadow-2xl">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
          <UserCheck className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          {isSignUp ? 'Join the future of education' : 'Sign in to your account'}
        </p>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-11 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
            />
          </div>
          
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium text-gray-700">Role</Label>
              <Select value={role} onValueChange={(value: 'student' | 'teacher' | 'admin') => setRole(value)}>
                <SelectTrigger className="h-11 bg-gray-50/50 border-gray-200 focus:bg-white">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </Button>
        </form>
        
        <div className="text-center">
          <Button
            variant="link"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </Button>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gray-500 font-medium">Or try demo</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin('student')}
            className="text-xs font-medium border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all"
          >
            Student
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin('teacher')}
            className="text-xs font-medium border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300 transition-all"
          >
            Teacher
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin('admin')}
            className="text-xs font-medium border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-all"
          >
            Admin
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}