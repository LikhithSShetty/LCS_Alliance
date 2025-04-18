import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/Layout/PageLayout';
import { useClasses } from '@/context/ClassContext';
import { useAuth } from '@/context/AuthContext';
import { VideoPlayer } from '@/components/Video/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Video } from '@/types';
import { AlertCircle, CalendarDays, Clock, Shield, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ClassPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const { 
    getClassById, 
    getClassVideos, 
    isEnrolled, 
    enrollInClass, 
    isLoading, 
    enrollmentStatus 
  } = useClasses();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  
  const classData = id ? getClassById(id) : undefined;
  const videos = id ? getClassVideos(id) : [];
  const userIsEnrolled = id ? isEnrolled(id) : false;
  const userEnrollmentStatus = id ? enrollmentStatus(id) : null;
  
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
  
  const renderEnrollmentStatus = () => {
    if (userIsEnrolled && userEnrollmentStatus === 'pending') {
      return (
        <Alert variant="default" className="mb-6 border-yellow-500 text-yellow-700">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertDescription>
            Your enrollment is pending approval. You'll have access to the videos once an administrator approves your enrollment.
          </AlertDescription>
        </Alert>
      );
    }
    
    if (userIsEnrolled && userEnrollmentStatus === 'rejected') {
      return (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your enrollment request has been rejected. Please contact an administrator for more information.
          </AlertDescription>
        </Alert>
      );
    }
    
    return null;
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
            {isAdmin() && (
              <div className="flex items-center">
                <Shield className="mr-1 h-4 w-4" />
                <span>Admin Access</span>
              </div>
            )}
          </div>
        </div>
        
        {renderEnrollmentStatus()}
        
        {(userIsEnrolled && userEnrollmentStatus === 'approved') || isAdmin() ? (
          <>
            {videos.length === 0 ? (
              <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No videos have been added to this class yet.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[3fr_1fr]">
                <div className="space-y-6">
                  {selectedVideo && <VideoPlayer video={selectedVideo} />}
                </div>
                <div>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Lecture Videos</CardTitle>
                      <CardDescription>
                        {videos.length} video{videos.length !== 1 ? 's' : ''} available
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {videos.map((video) => (
                          <Button
                            key={video.id}
                            variant={selectedVideo?.id === video.id ? 'default' : 'outline'}
                            className="w-full justify-start text-left h-auto py-2"
                            onClick={() => setSelectedVideo(video)}
                          >
                            <div>
                              <div className="font-medium">{video.title}</div>
                              <div className="text-xs text-muted-foreground">{video.subject} • {video.duration}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-muted/50 rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Enrollment Required</h3>
            <p className="text-muted-foreground mb-4">
              You need to enroll in this class to access the lecture videos.
            </p>
            <Button onClick={handleEnroll} disabled={isLoading || userIsEnrolled}>
              {isLoading ? 'Processing...' : userIsEnrolled ? 'Enrollment Pending' : 'Enroll Now'}
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default ClassPage;
