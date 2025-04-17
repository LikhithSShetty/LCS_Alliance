
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Class } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useClasses } from '@/context/ClassContext';
import { format } from 'date-fns';

interface ClassCardProps {
  classData: Class;
  isEnrolled?: boolean;
}

export const ClassCard = ({ classData, isEnrolled }: ClassCardProps) => {
  const { isLoading, enrollInClass, isEnrolled: checkEnrollment } = useClasses();
  const navigate = useNavigate();
  
  const enrollStatus = isEnrolled !== undefined ? isEnrolled : checkEnrollment(classData.id);
  
  const formattedDate = (() => {
    try {
      return format(new Date(classData.date), 'MMMM d, yyyy');
    } catch {
      return classData.date;
    }
  })();

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      {classData.imageUrl && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={classData.imageUrl}
            alt={classData.name}
            className="h-full w-full object-cover transition-all hover:scale-105"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{classData.name}</CardTitle>
          <Badge variant="outline" className="bg-lecture-100 text-lecture-700">
            {classData.subject}
          </Badge>
        </div>
        <CardDescription>{classData.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <CalendarDays className="mr-1 h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            <span>{classData.time}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {enrollStatus ? (
          <Button 
            variant="default" 
            className="w-full"
            onClick={() => navigate(`/class/${classData.id}`)}
          >
            View Lectures
          </Button>
        ) : (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => enrollInClass(classData.id)}
            disabled={isLoading}
          >
            {isLoading ? 'Enrolling...' : 'Enroll Now'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
