import React from 'react';
import { Video } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Clock } from 'lucide-react';

interface VideoPlayerProps {
  video: Video;
}

export const VideoPlayer = ({ video }: VideoPlayerProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl">{video.title}</CardTitle>
        <CardDescription>{video.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video w-full overflow-hidden rounded-md border bg-muted">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${video.videoId}?rel=0&modestbranding=1&showinfo=0&controls=1&cc_load_policy=1&iv_load_policy=3&loop=1&playlist=${video.videoId}`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <CalendarDays className="mr-1 h-4 w-4" />
            <span>Date: {video.date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            <span>Time: {video.time}</span>
          </div>
          {video.duration && (
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="mr-1 h-4 w-4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Duration: {video.duration}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
