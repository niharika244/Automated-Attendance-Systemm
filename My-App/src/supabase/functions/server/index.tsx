import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-df276c95/health", (c) => {
  return c.json({ status: "ok" });
});

// Authentication endpoints
app.post("/make-server-df276c95/signup", async (c) => {
  try {
    const { email, password, name, role } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Sign up error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user, message: 'User created successfully' });
  } catch (error) {
    console.log(`Sign up error during user creation: ${error}`);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

app.post("/make-server-df276c95/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.log(`Sign in error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user, session: data.session });
  } catch (error) {
    console.log(`Sign in error during authentication: ${error}`);
    return c.json({ error: 'Failed to sign in' }, 500);
  }
});

// Attendance endpoints
app.post("/make-server-df276c95/attendance/mark", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const attendanceData = await c.req.json();
    
    // Store attendance record in KV store
    const attendanceKey = `attendance_${user.id}_${Date.now()}`;
    const recordData = {
      student_id: user.id,
      timestamp: attendanceData.timestamp,
      method: attendanceData.method,
      location: attendanceData.location,
      subject: attendanceData.subject || 'General',
      status: 'present'
    };
    
    await kv.set(attendanceKey, recordData);
    
    return c.json({ 
      message: 'Attendance marked successfully',
      subject: recordData.subject,
      timestamp: recordData.timestamp
    });
  } catch (error) {
    console.log(`Attendance marking error: ${error}`);
    return c.json({ error: 'Failed to mark attendance' }, 500);
  }
});

app.get("/make-server-df276c95/attendance/student/:studentId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const studentId = c.req.param('studentId');
    
    // Get attendance records for student
    const records = await kv.getByPrefix(`attendance_${studentId}_`);
    
    return c.json({ records: records || [] });
  } catch (error) {
    console.log(`Error fetching attendance records: ${error}`);
    return c.json({ error: 'Failed to fetch attendance records' }, 500);
  }
});

// Student goals endpoints
app.post("/make-server-df276c95/goals", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const goalData = await c.req.json();
    const goalKey = `goal_${user.id}_${Date.now()}`;
    
    await kv.set(goalKey, {
      ...goalData,
      user_id: user.id,
      created_at: new Date().toISOString()
    });
    
    return c.json({ message: 'Goal created successfully', goalId: goalKey });
  } catch (error) {
    console.log(`Goal creation error: ${error}`);
    return c.json({ error: 'Failed to create goal' }, 500);
  }
});

app.get("/make-server-df276c95/goals/user/:userId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = c.req.param('userId');
    const goals = await kv.getByPrefix(`goal_${userId}_`);
    
    return c.json({ goals: goals || [] });
  } catch (error) {
    console.log(`Error fetching goals: ${error}`);
    return c.json({ error: 'Failed to fetch goals' }, 500);
  }
});

// Tasks endpoints
app.post("/make-server-df276c95/tasks/complete", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const taskData = await c.req.json();
    const completedTaskKey = `completed_task_${user.id}_${Date.now()}`;
    
    await kv.set(completedTaskKey, {
      ...taskData,
      user_id: user.id,
      completed_at: new Date().toISOString()
    });
    
    return c.json({ message: 'Task completed successfully' });
  } catch (error) {
    console.log(`Task completion error: ${error}`);
    return c.json({ error: 'Failed to complete task' }, 500);
  }
});

// Analytics endpoints for teachers and admins
app.get("/make-server-df276c95/analytics/attendance", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get all attendance records for analytics
    const allRecords = await kv.getByPrefix('attendance_');
    
    // Process analytics data
    const analytics = {
      totalRecords: allRecords?.length || 0,
      todayRecords: allRecords?.filter((record: any) => {
        const recordDate = new Date(record.timestamp).toDateString();
        const today = new Date().toDateString();
        return recordDate === today;
      }).length || 0,
      methodBreakdown: {
        qr: allRecords?.filter((record: any) => record.method === 'qr').length || 0,
        manual: allRecords?.filter((record: any) => record.method === 'manual').length || 0
      }
    };
    
    return c.json({ analytics });
  } catch (error) {
    console.log(`Analytics error: ${error}`);
    return c.json({ error: 'Failed to fetch analytics' }, 500);
  }
});

Deno.serve(app.fetch);