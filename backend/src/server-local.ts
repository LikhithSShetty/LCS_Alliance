import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// In-memory storage for local testing (replaces MongoDB)
interface LocalUser {
  id: string;
  username: string;
  email: string;
  password: string; // In production, this would be hashed
  role: 'student' | 'admin';
  createdAt: string;
}

// Mock database - in-memory storage
const mockDatabase: {
  users: LocalUser[];
  classes: any[];
  enrollments: any[];
  videos: any[];
} = {
  users: [
    {
      id: '1',
      username: 'admin',
      email: 'admin@test.com',
      password: 'admin123', // In real app, this would be hashed
      role: 'admin',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      username: 'student',
      email: 'student@test.com',
      password: 'student123',
      role: 'student',
      createdAt: new Date().toISOString(),
    },
  ],
  classes: [],
  enrollments: [],
  videos: [],
};

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

// Helper function to generate simple token (not secure, just for testing)
const generateTestToken = (userId: string, role: string): string => {
  return Buffer.from(`${userId}:${role}:${Date.now()}`).toString('base64');
};

// Basic Route
app.get('/api', (req: Request, res: Response) => {
  res.json({ 
    message: 'Welcome to the LCS Alliance Backend API! (Local Testing Mode)',
    mode: 'local',
    note: 'Using in-memory storage - data will reset on server restart'
  });
});

// Register Route
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { username, email, password, role } = req.body;

  console.log('Registration attempt:', { username, email, role });

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide username, email, and password' });
  }

  // Validate role if provided
  const userRole: 'student' | 'admin' = role && ['student', 'admin'].includes(role) ? role : 'student';

  // Check if user already exists
  const existingUser = mockDatabase.users.find(
    (u) => u.email === email || u.username === username
  );

  if (existingUser) {
    return res.status(400).json({ message: 'User already exists with this email or username' });
  }

  // Create new user
  const newUser: LocalUser = {
    id: String(mockDatabase.users.length + 1),
    username,
    email,
    password, // NOT HASHED - for testing only!
    role: userRole,
    createdAt: new Date().toISOString(),
  };

  mockDatabase.users.push(newUser);

  // Generate token
  const token = generateTestToken(newUser.id, newUser.role);

  console.log('User registered successfully:', { id: newUser.id, username: newUser.username });

  // Return response (same format as MongoDB version)
  res.status(201).json({
    token,
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    },
  });
});

// Login Route
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  console.log('Login attempt:', { email });

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  // Find user by email
  const user = mockDatabase.users.find((u) => u.email === email);

  if (!user) {
    console.log('User not found');
    return res.status(400).json({ message: 'Invalid Credentials' });
  }

  // Check password (plain text comparison - for testing only!)
  if (user.password !== password) {
    console.log('Password mismatch');
    return res.status(400).json({ message: 'Invalid Credentials' });
  }

  // Generate token
  const token = generateTestToken(user.id, user.role);

  console.log('Login successful:', { id: user.id, username: user.username });

  // Return response (same format as MongoDB version)
  res.status(200).json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

// Debug route to see all users (remove in production!)
app.get('/api/debug/users', (req: Request, res: Response) => {
  res.json({
    users: mockDatabase.users.map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role,
    })),
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`📍 CORS enabled for: ${FRONTEND_URL}`);
  console.log(`🧪 Running in LOCAL TESTING MODE`);
  console.log(`📝 In-memory storage - data will reset on restart`);
  console.log(`\n👤 Test users available:`);
  console.log(`   Admin: admin@test.com / admin123`);
  console.log(`   Student: student@test.com / student123`);
});
