import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/Layout/PageLayout';
import { useAuth } from '@/context/AuthContext';
import { useClasses } from '@/context/ClassContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Enrollment, Class, Video } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { BookOpen, FilePlus, UserPlus, Video as VideoIcon, AlertCircle, CheckCircle, PlusCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { 
    enrolledClasses, 
    classes, 
    videos, 
    enrollments, 
    createClass, 
    addVideo, 
    removeVideo,
    updateClassEnrollment,
    isLoading
  } = useClasses();
  
  // Form states
  const [newClass, setNewClass] = useState<Omit<Class, 'id'>>({
    name: '',
    subject: '',
    description: '',
    date: '',
    time: '',
    imageUrl: ''
  });
  
  const [newVideo, setNewVideo] = useState<Omit<Video, 'id'>>({
    title: '',
    videoId: '',
    classId: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    subject: '',
    description: ''
  });
  
  // Dialog states
  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  
  // Filter states
  const [enrollmentFilter, setEnrollmentFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Handle creating a new class
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    await createClass(newClass);
    setNewClass({
      name: '',
      subject: '',
      description: '',
      date: '',
      time: '',
      imageUrl: ''
    });
    setIsClassDialogOpen(false);
  };
  
  // Handle adding a new video
  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    await addVideo(newVideo);
    setNewVideo({
      title: '',
      videoId: '',
      classId: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      subject: '',
      description: ''
    });
    setIsVideoDialogOpen(false);
  };
  
  // Handle updating enrollment status
  const handleUpdateEnrollment = async (userId: string, classId: string, status: 'pending' | 'approved' | 'rejected') => {
    await updateClassEnrollment(userId, classId, status);
  };
  
  // Get filtered enrollments
  const getFilteredEnrollments = () => {
    if (enrollmentFilter === 'all') {
      return enrollments;
    }
    return enrollments.filter(enrollment => enrollment.status === enrollmentFilter);
  };
  
  // Get user name by ID
  const getUsernameById = (userId: string) => {
    return 'User ' + userId; // In a real app, you would fetch this from the user database
  };
  
  // Get class name by ID
  const getClassNameById = (classId: string) => {
    const cls = classes.find(c => c.id === classId);
    return cls ? cls.name : 'Unknown Class';
  };
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <PageLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <Tabs defaultValue={isAdmin() ? "admin" : "classes"} className="space-y-6">
          <TabsList>
            <TabsTrigger value="classes">
              <BookOpen className="mr-2 h-4 w-4" />
              My Classes
            </TabsTrigger>
            {isAdmin() && (
              <TabsTrigger value="admin">
                <UserPlus className="mr-2 h-4 w-4" />
                Admin
              </TabsTrigger>
            )}
          </TabsList>
          
          {/* Student View - Enrolled Classes */}
          <TabsContent value="classes" className="space-y-6">
            {enrolledClasses.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You are not enrolled in any classes yet. Browse available classes to enroll.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {enrolledClasses.map((cls) => (
                  <Card key={cls.id} className="overflow-hidden">
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
                      <CardTitle>{cls.name}</CardTitle>
                      <CardDescription>{cls.subject}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">{cls.description}</p>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <p>Date: {cls.date}</p>
                        <p>Time: {cls.time}</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="default" 
                        className="w-full"
                        onClick={() => navigate(`/class/${cls.id}`)}
                      >
                        View Lectures
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
          </div>
            )}
            
            <div className="flex justify-center">
          <Button
                variant="outline" 
                className="mt-4"
            onClick={() => navigate('/classes')}
          >
            Browse All Classes
          </Button>
        </div>
          </TabsContent>
          
          {/* Admin View */}
          {isAdmin() && (
            <TabsContent value="admin" className="space-y-8">
              <Tabs defaultValue="classes">
                <TabsList className="mb-6">
                  <TabsTrigger value="classes">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Class Management
                  </TabsTrigger>
                  <TabsTrigger value="enrollments">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Enrollments
                  </TabsTrigger>
                  <TabsTrigger value="videos">
                    <VideoIcon className="mr-2 h-4 w-4" />
                    Videos
                  </TabsTrigger>
                </TabsList>
                
                {/* Class Management */}
                <TabsContent value="classes" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">All Classes</h3>
                    <Dialog open={isClassDialogOpen} onOpenChange={setIsClassDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Create Class
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <form onSubmit={handleCreateClass}>
                          <DialogHeader>
                            <DialogTitle>Create New Class</DialogTitle>
                            <DialogDescription>
                              Add a new class to the system. Fill out all fields below.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="name">Class Name</Label>
                              <Input
                                id="name"
                                value={newClass.name}
                                onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="subject">Subject</Label>
                              <Input
                                id="subject"
                                value={newClass.subject}
                                onChange={(e) => setNewClass({...newClass, subject: e.target.value})}
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                value={newClass.description}
                                onChange={(e) => setNewClass({...newClass, description: e.target.value})}
                                required
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                  id="date"
                                  type="date"
                                  value={newClass.date}
                                  onChange={(e) => setNewClass({...newClass, date: e.target.value})}
                                  required
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="time">Time</Label>
                                <Input
                                  id="time"
                                  type="time"
                                  value={newClass.time}
                                  onChange={(e) => setNewClass({...newClass, time: e.target.value})}
                                  required
                                />
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                              <Input
                                id="imageUrl"
                                value={newClass.imageUrl}
                                onChange={(e) => setNewClass({...newClass, imageUrl: e.target.value})}
                                placeholder="https://example.com/image.jpg"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                              {isLoading ? 'Creating...' : 'Create Class'}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {classes.map((cls) => (
                      <Card key={cls.id} className="overflow-hidden">
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
                          <CardTitle>{cls.name}</CardTitle>
                          <CardDescription>{cls.subject}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">{cls.description}</p>
                          <div className="mt-2 text-sm text-muted-foreground">
                            <p>Date: {cls.date}</p>
                            <p>Time: {cls.time}</p>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            variant="default" 
                            className="w-full"
                            onClick={() => navigate(`/class/${cls.id}`)}
                          >
                            Manage Class
                          </Button>
                        </CardFooter>
                      </Card>
              ))}
            </div>
                </TabsContent>
                
                {/* Enrollment Management */}
                <TabsContent value="enrollments" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Student Enrollments</h3>
                    <Select 
                      value={enrollmentFilter} 
                      onValueChange={(value) => setEnrollmentFilter(value as 'all' | 'pending' | 'approved' | 'rejected')}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Enrollments</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {getFilteredEnrollments().length === 0 ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No enrollments found matching your filter criteria.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="border rounded-md">
                      <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 p-4 font-medium border-b">
                        <div>Student</div>
                        <div>Class</div>
                        <div>Status</div>
                        <div>Actions</div>
                      </div>
                      {getFilteredEnrollments().map((enrollment) => (
                        <div 
                          key={`${enrollment.userId}-${enrollment.classId}`}
                          className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 p-4 border-b last:border-0 items-center"
                        >
                          <div className="font-medium">{getUsernameById(enrollment.userId)}</div>
                          <div>{getClassNameById(enrollment.classId)}</div>
                          <div>
                            <Badge
                              variant={
                                enrollment.status === 'approved' 
                                  ? 'default'
                                  : enrollment.status === 'rejected'
                                  ? 'destructive'
                                  : 'outline'
                              }
                            >
                              {enrollment.status}
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            {enrollment.status !== 'approved' && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0"
                                onClick={() => handleUpdateEnrollment(enrollment.userId, enrollment.classId, 'approved')}
                                disabled={isLoading}
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span className="sr-only">Approve</span>
                              </Button>
                            )}
                            {enrollment.status !== 'rejected' && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0"
                                onClick={() => handleUpdateEnrollment(enrollment.userId, enrollment.classId, 'rejected')}
                                disabled={isLoading}
                              >
                                <XCircle className="h-4 w-4" />
                                <span className="sr-only">Reject</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                {/* Video Management */}
                <TabsContent value="videos" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">All Videos</h3>
                    <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <FilePlus className="mr-2 h-4 w-4" />
                          Add Video
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <form onSubmit={handleAddVideo}>
                          <DialogHeader>
                            <DialogTitle>Add New Video</DialogTitle>
                            <DialogDescription>
                              Add a new unlisted YouTube video to a class. You must have already uploaded the video to YouTube.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="videoTitle">Video Title</Label>
                              <Input
                                id="videoTitle"
                                value={newVideo.title}
                                onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="videoId">YouTube Video ID</Label>
                              <Input
                                id="videoId"
                                value={newVideo.videoId}
                                onChange={(e) => setNewVideo({...newVideo, videoId: e.target.value})}
                                required
                                placeholder="e.g., dQw4w9WgXcQ"
                              />
                              <p className="text-xs text-muted-foreground">
                                The ID is in the YouTube URL: youtube.com/watch?v=<strong>dQw4w9WgXcQ</strong>
                              </p>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="videoClass">Associated Class</Label>
                              <Select 
                                value={newVideo.classId} 
                                onValueChange={(value) => setNewVideo({...newVideo, classId: value})}
                              >
                                <SelectTrigger id="videoClass">
                                  <SelectValue placeholder="Select a class" />
                                </SelectTrigger>
                                <SelectContent>
                                  {classes.map((cls) => (
                                    <SelectItem key={cls.id} value={cls.id}>
                                      {cls.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="videoSubject">Subject/Topic</Label>
                              <Input
                                id="videoSubject"
                                value={newVideo.subject}
                                onChange={(e) => setNewVideo({...newVideo, subject: e.target.value})}
                                required
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="videoDate">Date</Label>
                                <Input
                                  id="videoDate"
                                  type="date"
                                  value={newVideo.date}
                                  onChange={(e) => setNewVideo({...newVideo, date: e.target.value})}
                                  required
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="videoTime">Time</Label>
                                <Input
                                  id="videoTime"
                                  type="time"
                                  value={newVideo.time}
                                  onChange={(e) => setNewVideo({...newVideo, time: e.target.value})}
                                  required
                                />
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="videoDescription">Description (Optional)</Label>
                              <Textarea
                                id="videoDescription"
                                value={newVideo.description}
                                onChange={(e) => setNewVideo({...newVideo, description: e.target.value})}
                                placeholder="Provide a brief description of the video content"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                              {isLoading ? 'Adding...' : 'Add Video'}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  {videos.length === 0 ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No videos have been added yet. Click "Add Video" to add your first video.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="border rounded-md">
                      <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 p-4 font-medium border-b">
                        <div>Title</div>
                        <div>Class</div>
                        <div>Subject</div>
                        <div>Actions</div>
                      </div>
                      {videos.map((video) => (
                        <div 
                          key={video.id}
                          className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 p-4 border-b last:border-0 items-center"
                        >
                          <div className="font-medium">{video.title}</div>
                          <div>{getClassNameById(video.classId)}</div>
                          <div>{video.subject}</div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 w-8 p-0"
                              onClick={() => window.open(`https://youtu.be/${video.videoId}`, '_blank')}
                            >
                              <VideoIcon className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 w-8 p-0"
                              onClick={() => navigate(`/class/${video.classId}`)}
                            >
                              <BookOpen className="h-4 w-4" />
                              <span className="sr-only">Class</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              className="h-8 w-8 p-0"
                              onClick={() => removeVideo(video.id)}
                              disabled={isLoading}
                            >
                              <XCircle className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
              </Button>
            </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
