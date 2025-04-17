
import React from 'react';
import { PageLayout } from '@/components/Layout/PageLayout';
import { useClasses } from '@/context/ClassContext';
import { ClassCard } from '@/components/Class/ClassCard';

const Classes = () => {
  const { classes, isLoading } = useClasses();
  
  return (
    <PageLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">Available Classes</h1>
        <p className="text-muted-foreground mb-8">
          Browse and enroll in our selection of classes
        </p>
        
        {isLoading ? (
          <p>Loading classes...</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
              <ClassCard key={cls.id} classData={cls} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Classes;
