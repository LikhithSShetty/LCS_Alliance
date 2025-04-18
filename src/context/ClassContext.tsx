import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Class, Enrollment, Video, User } from '@/types';
import { useAuth } from './AuthContext';
import { useToast } from "@/components/ui/use-toast";

interface ClassContextType {
  classes: Class[];
  enrolledClasses: Class[];
  videos: Video[];
  enrollments: Enrollment[];
  isLoading: boolean;
  error: string | null;
  getClassById: (id: string) => Class | undefined;
  getClassVideos: (classId: string) => Video[];
  getClassEnrollments: (classId: string) => Enrollment[];
  enrollInClass: (classId: string) => Promise<void>;
  isEnrolled: (classId: string) => boolean;
  enrollmentStatus: (classId: string) => 'pending' | 'approved' | 'rejected' | null;
  createClass: (classData: Omit<Class, 'id'>) => Promise<void>;
  updateClassEnrollment: (userId: string, classId: string, status: 'pending' | 'approved' | 'rejected') => Promise<void>;
  addVideo: (videoData: Omit<Video, 'id'>) => Promise<void>;
  removeVideo: (videoId: string) => Promise<void>;
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
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
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
        
        // Load classes from localStorage if available
        const storedClasses = localStorage.getItem('classes');
        if (storedClasses) {
          setClasses(JSON.parse(storedClasses));
        } else {
          localStorage.setItem('classes', JSON.stringify(classes));
        }
        
        // Load videos from localStorage if available
        const storedVideos = localStorage.getItem('videos');
        if (storedVideos) {
          setVideos(JSON.parse(storedVideos));
        } else {
          localStorage.setItem('videos', JSON.stringify(videos));
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
    // Only return videos if the user is enrolled in the class or is an admin
    if (!user) return [];
    
    if (isAdmin() || enrollments.some(
      enrollment => 
        enrollment.classId === classId && 
        enrollment.userId === user.id &&
        enrollment.status === 'approved'
    )) {
      return videos.filter(video => video.classId === classId);
    }
    
    return [];
  };
  
  const getClassEnrollments = (classId: string) => {
    if (!user || !isAdmin()) return [];
    
    return enrollments.filter(enrollment => enrollment.classId === classId);
  };

  const isEnrolled = (classId: string) => {
    if (!user) return false;
    
    return enrollments.some(
      enrollment => 
        enrollment.classId === classId && 
        enrollment.userId === user.id
    );
  };
  
  const enrollmentStatus = (classId: string) => {
    if (!user) return null;
    
    const enrollment = enrollments.find(
      e => e.classId === classId && e.userId === user.id
    );
    
    return enrollment ? enrollment.status : null;
  };

  const enrollInClass = async (classId: string) => {
    if (!user) {
      setError('You must be logged in to enroll in a class');
      toast({
        title: "Enrollment Failed",
        description: "You must be logged in to enroll in a class",
        variant: "destructive"
      });
      return;
    }

    // Check if already enrolled
    if (isEnrolled(classId)) {
      setError('You are already enrolled in this class');
      toast({
        title: "Already Enrolled",
        description: "You are already enrolled in this class",
        variant: "destructive"
      });
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
      
      toast({
        title: "Enrollment Successful",
        description: "You have successfully enrolled in this class",
      });
    } catch (error) {
      setError('Failed to enroll in class');
      toast({
        title: "Enrollment Failed",
        description: "Failed to enroll in class",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateClassEnrollment = async (userId: string, classId: string, status: 'pending' | 'approved' | 'rejected') => {
    if (!user || !isAdmin()) {
      setError('You are not authorized to perform this action');
      toast({
        title: "Authorization Error",
        description: "You are not authorized to perform this action",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedEnrollments = enrollments.map(enrollment => {
        if (enrollment.userId === userId && enrollment.classId === classId) {
          return { ...enrollment, status };
        }
        return enrollment;
      });
      
      setEnrollments(updatedEnrollments);
      
      // Store in localStorage for persistence
      localStorage.setItem('enrollments', JSON.stringify(updatedEnrollments));
      
      toast({
        title: "Enrollment Updated",
        description: `Enrollment status updated to ${status}`,
      });
    } catch (error) {
      setError('Failed to update enrollment');
      toast({
        title: "Update Failed",
        description: "Failed to update enrollment status",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const createClass = async (classData: Omit<Class, 'id'>) => {
    if (!user || !isAdmin()) {
      setError('You are not authorized to perform this action');
      toast({
        title: "Authorization Error",
        description: "You are not authorized to perform this action",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newClass: Class = {
        ...classData,
        id: Math.random().toString(36).substring(2, 9)
      };
      
      const updatedClasses = [...classes, newClass];
      setClasses(updatedClasses);
      
      // Store in localStorage for persistence
      localStorage.setItem('classes', JSON.stringify(updatedClasses));
      
      toast({
        title: "Class Created",
        description: "New class has been created successfully",
      });
    } catch (error) {
      setError('Failed to create class');
      toast({
        title: "Class Creation Failed",
        description: "Failed to create new class",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const addVideo = async (videoData: Omit<Video, 'id'>) => {
    if (!user || !isAdmin()) {
      setError('You are not authorized to perform this action');
      toast({
        title: "Authorization Error",
        description: "You are not authorized to perform this action",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newVideo: Video = {
        ...videoData,
        id: Math.random().toString(36).substring(2, 9)
      };
      
      const updatedVideos = [...videos, newVideo];
      setVideos(updatedVideos);
      
      // Store in localStorage for persistence
      localStorage.setItem('videos', JSON.stringify(updatedVideos));
      
      toast({
        title: "Video Added",
        description: "New video has been added successfully",
      });
    } catch (error) {
      setError('Failed to add video');
      toast({
        title: "Video Addition Failed",
        description: "Failed to add new video",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const removeVideo = async (videoId: string) => {
    if (!user || !isAdmin()) {
      setError('You are not authorized to perform this action');
      toast({
        title: "Authorization Error",
        description: "You are not authorized to perform this action",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedVideos = videos.filter(video => video.id !== videoId);
      setVideos(updatedVideos);
      
      // Store in localStorage for persistence
      localStorage.setItem('videos', JSON.stringify(updatedVideos));
      
      toast({
        title: "Video Removed",
        description: "Video has been removed successfully",
      });
    } catch (error) {
      setError('Failed to remove video');
      toast({
        title: "Video Removal Failed",
        description: "Failed to remove video",
        variant: "destructive"
      });
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
        getClassEnrollments,
        enrollInClass,
        isEnrolled,
        enrollmentStatus,
        createClass,
        updateClassEnrollment,
        addVideo,
        removeVideo
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
