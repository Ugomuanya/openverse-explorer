
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  className?: string;
  autoPlay?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  src, 
  poster,
  title,
  className,
  autoPlay = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize video 
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    if (autoPlay) {
      try {
        video.play().catch(e => {
          console.log("Auto-play prevented:", e);
          setIsPlaying(false);
        });
      } catch (err) {
        console.error("Error in auto-play:", err);
      }
    }

    const handleLoadedData = () => {
      setIsLoaded(true);
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
    };

    const handleError = () => {
      setError("Error loading video. Please try again.");
      setIsLoaded(false);
    };

    // Add event listeners
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    // Cleanup function
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [src, autoPlay]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(e => {
        console.error("Play failed:", e);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !video.muted;
    setIsMuted(!isMuted);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(parseFloat(e.target.value));
  };

  // Format time to mm:ss
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <p className="text-destructive">{error}</p>
        </div>
      )}
      
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="animate-pulse h-12 w-12 rounded-full bg-muted-foreground/20"></div>
        </div>
      )}

      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        preload="metadata"
      />

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/20 hover:bg-white/40 text-white rounded-full h-8 w-8"
            onClick={togglePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/20 hover:bg-white/40 text-white rounded-full h-8 w-8"
            onClick={toggleMute}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          
          <div className="text-xs text-white/80 ml-2">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
        
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          className="w-full h-1.5 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
        />
        
        {title && (
          <div className="text-sm text-white font-medium mt-2 line-clamp-1">
            {title}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
