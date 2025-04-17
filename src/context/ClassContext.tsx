import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Class, Enrollment, Video, User } from '@/types';
import { useAuth } from './AuthContext';

interface ClassContextType {
  classes: Class[];
  enrolledClasses: Class[];
  videos: Video[];
  enrollments: Enrollment[];
  isLoading: boolean;
  error: string | null;
  getClassById: (id: string) => Class | undefined;
  getClassVideos: (classId: string) => Video[];
  enrollInClass: (classId: string) => Promise<void>;
  isEnrolled: (classId: string) => boolean;
}

const ClassContext = createContext<ClassContextType | undefined>(undefined);

// Mock data for demo
const mockClasses: Class[] = [
  {
    id: '1',
    name: 'Introduction to Computer Science',
    subject: 'Computer Science',
    description: 'Learn the fundamentals of computer science, including algorithms, data structures, and programming concepts.',
    date: '2023-01-15',
    time: '10:00 AM',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'
  },
  {
    id: '2',
    name: 'Advanced Mathematics',
    subject: 'Mathematics',
    description: 'Explore complex mathematical concepts including calculus, linear algebra, and differential equations.',
    date: '2023-01-16',
    time: '2:00 PM',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb'
  },
  {
    id: '3',
    name: 'Physics 101',
    subject: 'Physics',
    description: 'An introduction to the fundamental principles of physics, covering mechanics, thermodynamics, and waves.',
    date: '2023-01-17',
    time: '9:00 AM',
    imageUrl: 'https://images.unsplash.com/photo-1636466497217-0d7c9ca4376b'
  },
  {
    id: '4',
    name: 'Web Development Fundamentals',
    subject: 'Web Development',
    description: 'Learn HTML, CSS, and JavaScript to build responsive websites and web applications.',
    date: '2023-01-18',
    time: '11:00 AM',
    imageUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159'
  },
];

const mockVideos: Video[] = [
  {
    id: '1',
    title: 'LCS ALLIANCE UNIVERSITY Orientation',
    videoId: '6DG-aUuFxfY',
    classId: '1',
    date: new Date().toISOString().split('T')[0], // Today's date
    time: new Date().toLocaleTimeString(),
    subject: 'University Orientation',
    description: 'Welcome orientation for new students at LCS ALLIANCE UNIVERSITY',
    duration: '2:13:20'
  },
  {
    id: '2',
    title: 'Intro to CS - Lecture 1: Algorithms',
    videoId: 'dQw4w9WgXcQ', // Replace with actual YouTube video ID
    classId: '1',
    date: '2023-01-15',
    time: '10:00 AM',
    subject: 'Algorithms',
    description: 'Introduction to fundamental algorithms and their analysis.',
    duration: '45:20'
  },
  {
    id: '3',
    title: 'Intro to CS - Lecture 2: Data Structures',
    videoId: 'dQw4w9WgXcQ', // Replace with actual YouTube video ID
    classId: '1',
    date: '2023-01-17',
    time: '10:00 AM',
    subject: 'Data Structures',
    description: 'Overview of essential data structures for efficient programming.',
    duration: '50:15'
  },
  {
    id: '4',
    title: 'Advanced Math - Lecture 1: Calculus Review',
    videoId: 'dQw4w9WgXcQ', // Replace with actual YouTube video ID
    classId: '2',
    date: '2023-01-16',
    time: '2:00 PM',
    subject: 'Calculus',
    description: 'Review of essential calculus concepts needed for the course.',
    duration: '55:00'
  },
  {
    id: '5',
    title: 'Physics 101 - Lecture 1: Newton\'s Laws',
    videoId: 'dQw4w9WgXcQ', // Replace with actual YouTube video ID
    classId: '3',
    date: '2023-01-17',
    time: '9:00 AM',
    subject: 'Mechanics',
    description: 'Introduction to Newton\'s three laws of motion.',
    duration: '48:30'
  },
  {
    id: '6',
    title: 'Web Development - Lecture 1: HTML Basics',
    videoId: 'dQw4w9WgXcQ', // Replace with actual YouTube video ID
    classId: '4',
    date: '2023-01-18',
    time: '11:00 AM',
    subject: 'HTML',
    description: 'Introduction to HTML tags, elements, and document structure.',
    duration: '42:10'
  },
];

export const ClassProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>(mockClasses);
  const [videos, setVideos] = useState<Video[]>(mockVideos);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Load enrollments from localStorage
        const storedEnrollments = localStorage.getItem('enrollments');
        if (storedEnrollments) {
          setEnrollments(JSON.parse(storedEnrollments));
        }
      } catch (error) {
        setError('Failed to load data');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Get enrolled classes for current user
  const enrolledClasses = user
    ? classes.filter(cls => 
        enrollments.some(enrollment => 
          enrollment.classId === cls.id && 
          enrollment.userId === user.id &&
          enrollment.status === 'approved'
        )
      )
    : [];

  const getClassById = (id: string) => {
    return classes.find(cls => cls.id === id);
  };

  const getClassVideos = (classId: string) => {
    return videos.filter(video => video.classId === classId);
  };

  const isEnrolled = (classId: string) => {
    if (!user) return false;
    
    return enrollments.some(
      enrollment => 
        enrollment.classId === classId && 
        enrollment.userId === user.id &&
        enrollment.status === 'approved'
    );
  };

  const enrollInClass = async (classId: string) => {
    if (!user) {
      setError('You must be logged in to enroll in a class');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newEnrollment: Enrollment = {
        userId: user.id,
        classId,
        status: 'approved', // Auto-approve for demo purposes
        enrollDate: new Date().toISOString()
      };
      
      const updatedEnrollments = [...enrollments, newEnrollment];
      setEnrollments(updatedEnrollments);
      
      // Store in localStorage for persistence
      localStorage.setItem('enrollments', JSON.stringify(updatedEnrollments));
    } catch (error) {
      setError('Failed to enroll in class');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ClassContext.Provider
      value={{
        classes,
        enrolledClasses,
        videos,
        enrollments,
        isLoading,
        error,
        getClassById,
        getClassVideos,
        enrollInClass,
        isEnrolled
      }}
    >
      {children}
    </ClassContext.Provider>
  );
};

export const useClasses = () => {
  const context = useContext(ClassContext);
  if (context === undefined) {
    throw new Error('useClasses must be used within a ClassProvider');
  }
  return context;
};
