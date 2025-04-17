
import React from 'react';
import { PageLayout } from '@/components/Layout/PageLayout';
import { useClasses } from '@/context/ClassContext';
import { ClassCard } from '@/components/Class/ClassCard';
import { VideoPlayer } from '@/components/Video/VideoPlayer';
import { format, isToday, parseISO } from 'date-fns';

const Classes = () => {
  const { classes, isLoading, videos } = useClasses();
  
  // Filter classes to show only today's classes
  const todaysClasses = classes.filter(cls => {
    try {
      return isToday(parseISO(cls.date));
    } catch {
      return false;
    }
  });
  
  // Find orientation video (for today's showcase)
  const orientationVideo = videos.find(video => video.title.includes('Orientation'));
  
  return (
    <PageLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">Today's Classes</h1>
        <p className="text-muted-foreground mb-8">
          Classes uploaded today ({format(new Date(), 'MMMM d, yyyy')})
        </p>
        
        {isLoading ? (
          <p>Loading classes...</p>
        ) : (
          <div className="space-y-8">
            {orientationVideo && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Featured Orientation</h2>
                <VideoPlayer video={orientationVideo} />
              </div>
            )}
            
            {todaysClasses.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Today's Classes</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {todaysClasses.map((cls) => (
                    <ClassCard key={cls.id} classData={cls} />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No additional classes have been uploaded today.
              </p>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Classes;
