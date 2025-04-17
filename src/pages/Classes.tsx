
import React from 'react';
import { PageLayout } from '@/components/Layout/PageLayout';
import { useClasses } from '@/context/ClassContext';
import { ClassCard } from '@/components/Class/ClassCard';
import { format, isToday, parseISO } from 'date-fns';

const Classes = () => {
  const { classes, isLoading } = useClasses();
  
  // Filter classes to show only today's classes
  const todaysClasses = classes.filter(cls => {
    try {
      return isToday(parseISO(cls.date));
    } catch {
      return false;
    }
  });
  
  return (
    <PageLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">Today's Classes</h1>
        <p className="text-muted-foreground mb-8">
          Classes uploaded today ({format(new Date(), 'MMMM d, yyyy')})
        </p>
        
        {isLoading ? (
          <p>Loading classes...</p>
        ) : todaysClasses.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {todaysClasses.map((cls) => (
              <ClassCard key={cls.id} classData={cls} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No classes have been uploaded today.
          </p>
        )}
      </div>
    </PageLayout>
  );
};

export default Classes;
