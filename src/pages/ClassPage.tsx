
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/Layout/PageLayout';
import { useClasses } from '@/context/ClassContext';
import { useAuth } from '@/context/AuthContext';
import { VideoPlayer } from '@/components/Video/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video } from '@/types';
import { CalendarDays, Clock, Users } from 'lucide-react';

const ClassPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { getClassById, getClassVideos, isEnrolled, enrollInClass, isLoading } = useClasses();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  
  const classData = id ? getClassById(id) : undefined;
  const videos = id ? getClassVideos(id) : [];
  const userIsEnrolled = id ? isEnrolled(id) : false;
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!classData) {
      navigate('/classes');
      return;
    }
    
    // Set the first video as selected by default
    if (videos.length > 0 && !selectedVideo) {
      setSelectedVideo(videos[0]);
    }
  }, [isAuthenticated, classData, videos, selectedVideo, navigate]);
  
  if (!classData) {
    return null;
  }
  
  const handleEnroll = async () => {
    if (id) {
      await enrollInClass(id);
    }
  };
  
  return (
    <PageLayout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{classData.name}</h1>
          <p className="text-muted-foreground">{classData.description}</p>
          
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CalendarDays className="mr-1 h-4 w-4" />
              <span>Date: {classData.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              <span>Time: {classData.time}</span>
            </div>
            <div className="flex items-center">
              <Users className="mr-1 h-4 w-4" />
              <span>Subject: {classData.subject}</span>
            </div>
          </div>
        </div>
        
        {userIsEnrolled ? (
          <div className="grid gap-6 lg:grid-cols-[3fr_1fr]">
            <div className="space-y-6">
              {selectedVideo && <VideoPlayer video={selectedVideo} />}
            </div>
            <div>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-4">Lecture Videos</h3>
                  <div className="space-y-2">
                    {videos.map((video) => (
                      <Button
                        key={video.id}
                        variant={selectedVideo?.id === video.id ? 'default' : 'outline'}
                        className="w-full justify-start"
                        onClick={() => setSelectedVideo(video)}
                      >
                        {video.title}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="bg-muted/50 rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Enrollment Required</h3>
            <p className="text-muted-foreground mb-4">
              You need to enroll in this class to access the lecture videos.
            </p>
            <Button onClick={handleEnroll} disabled={isLoading}>
              {isLoading ? 'Enrolling...' : 'Enroll Now'}
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default ClassPage;
