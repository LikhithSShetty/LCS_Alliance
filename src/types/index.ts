
// Define core types for the application

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'student' | 'admin';
}

export interface Class {
  id: string;
  name: string;
  subject: string;
  description: string;
  date: string;
  time: string;
  imageUrl?: string;
}

export interface Enrollment {
  userId: string;
  classId: string;
  status: 'pending' | 'approved' | 'rejected';
  enrollDate: string;
}

export interface Video {
  id: string;
  title: string;
  videoId: string; // YouTube Video ID
  classId: string;
  date: string;
  time: string;
  subject: string;
  description?: string;
  duration?: string;
}
