import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/Layout/PageLayout';
import { useClasses } from '@/context/ClassContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { CalendarDays, Clock, Users } from 'lucide-react';

const Classes = () => {
  const navigate = useNavigate();
  const { classes, enrollInClass, isEnrolled, enrollmentStatus, isLoading } = useClasses();
  const { isAuthenticated } = useAuth();
  
  const handleClassClick = (classId: string) => {
    navigate(`/class/${classId}`);
  };
  
  const handleEnroll = async (e: React.MouseEvent, classId: string) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    await enrollInClass(classId);
  };
  
  const getEnrollmentBadge = (classId: string) => {
    if (!isAuthenticated) return null;
    
    const status = enrollmentStatus(classId);
    
    if (status === 'approved') {
      return <Badge variant="success">Enrolled</Badge>;
    } else if (status === 'pending') {
      return <Badge variant="outline">Pending Approval</Badge>;
    } else if (status === 'rejected') {
      return <Badge variant="destructive">Enrollment Rejected</Badge>;
    }
    
    return null;
  };
  
  return (
    <PageLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Available Classes</h1>
            <p className="text-muted-foreground">
              Browse and enroll in our collection of classes
            </p>
          </div>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <Card 
              key={cls.id} 
              className="overflow-hidden cursor-pointer transition-all hover:shadow-md"
              onClick={() => handleClassClick(cls.id)}
            >
              {cls.imageUrl && (
                <div className="h-40 w-full overflow-hidden">
                  <img 
                    src={cls.imageUrl} 
                    alt={cls.name} 
                    className="h-full w-full object-cover transition-all hover:scale-105"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{cls.name}</CardTitle>
                  {getEnrollmentBadge(cls.id)}
                </div>
                <CardDescription>{cls.subject}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{cls.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <CalendarDays className="mr-1 h-4 w-4" />
                    <span>{cls.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>{cls.time}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {!isEnrolled(cls.id) ? (
                  <Button 
                    className="w-full"
                    onClick={(e) => handleEnroll(e, cls.id)}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Enroll Now'}
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/class/${cls.id}`);
                    }}
                  >
                    View Class
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Classes;
