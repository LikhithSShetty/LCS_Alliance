
import React, { useEffect } from 'react';
import { PageLayout } from '@/components/Layout/PageLayout';
import { useAuth } from '@/context/AuthContext';
import { useClasses } from '@/context/ClassContext';
import { ClassCard } from '@/components/Class/ClassCard';
import { VideoPlayer } from '@/components/Video/VideoPlayer';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { enrolledClasses, isLoading, videos } = useClasses();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Find orientation video to display for all users
  const orientationVideo = videos.find(video => video.title.includes('Orientation'));
  
  if (!user) {
    return null;
  }
  
  return (
    <PageLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {user.username}</h1>
            <p className="text-muted-foreground">
              Here's your learning dashboard
            </p>
          </div>
          <Button
            onClick={() => navigate('/classes')}
            className="mt-4 md:mt-0"
          >
            Browse All Classes
          </Button>
        </div>
        
        {orientationVideo && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">University Orientation</h2>
            <VideoPlayer video={orientationVideo} />
          </section>
        )}
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">My Enrolled Classes</h2>
          {isLoading ? (
            <p>Loading your classes...</p>
          ) : enrolledClasses.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {enrolledClasses.map((cls) => (
                <ClassCard key={cls.id} classData={cls} isEnrolled={true} />
              ))}
            </div>
          ) : (
            <div className="bg-muted/50 rounded-lg p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No classes yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't enrolled in any classes yet. Browse available classes to get started.
              </p>
              <Button onClick={() => navigate('/classes')}>
                Find Classes
              </Button>
            </div>
          )}
        </section>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
