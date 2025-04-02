
import React, { useState } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { OpenverseMedia, OpenverseImageMedia, OpenverseAudioMedia, OpenverseVideoMedia } from '@/types';
import { Music, Image, Play, Pause, Video, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

interface MediaCardProps {
  media: OpenverseMedia;
  onClick: (media: OpenverseMedia) => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ media, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  // Improved type checking for media types
  const isImage = 'width' in media && 'height' in media;
  const isAudio = 'audio_set' in media || ('duration' in media && !('video_codec' in media));
  const isVideo = 'video_codec' in media || ('duration' in media && !isAudio);

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!audioRef && isAudio) {
      const audio = new Audio((media as OpenverseAudioMedia).url);
      audio.addEventListener('ended', () => setIsPlaying(false));
      setAudioRef(audio);
      
      audio.play();
      setIsPlaying(true);
    } else if (audioRef) {
      if (isPlaying) {
        audioRef.pause();
      } else {
        audioRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(media)}
      className="group relative overflow-hidden rounded-lg border border-border/40 bg-card shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      {/* Content depends on media type */}
      {isImage && (
        <div className="relative">
          <AspectRatio ratio={4/3} className="bg-secondary/30">
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="animate-pulse h-12 w-12 rounded-full bg-muted-foreground/20"></div>
              </div>
            )}
            <img 
              src={(media as OpenverseImageMedia).thumbnail} 
              alt={(media as OpenverseImageMedia).title || 'Media thumbnail'}
              className={`object-cover w-full h-full transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={handleImageLoad}
            />
          </AspectRatio>
        </div>
      )}
      
      {isAudio && (
        <div className="relative">
          <AspectRatio ratio={4/3} className="bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="absolute inset-0 flex items-center justify-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-16 w-16 rounded-full bg-primary/80 text-primary-foreground hover:bg-primary/90"
                onClick={handlePlayToggle}
              >
                {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
              </Button>
            </div>
            
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent"></div>
            
            {(media as OpenverseAudioMedia).waveform && (
              <div className="absolute inset-0 opacity-50">
                <img 
                  src={(media as OpenverseAudioMedia).waveform} 
                  alt="Audio waveform" 
                  className="w-full h-full object-cover opacity-30"
                />
              </div>
            )}
          </AspectRatio>
        </div>
      )}

      {isVideo && (
        <div className="relative">
          <AspectRatio ratio={4/3} className="bg-secondary/30">
            {!isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="animate-pulse h-12 w-12 rounded-full bg-muted-foreground/20"></div>
              </div>
            )}
            <img 
              src={media.thumbnail || (media as OpenverseVideoMedia).video_thumbnail || '/placeholder.svg'} 
              alt={(media as OpenverseVideoMedia).title || 'Video thumbnail'}
              className={`object-cover w-full h-full transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={handleImageLoad}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/80 text-primary-foreground flex items-center justify-center">
                <Play className="h-8 w-8" />
              </div>
            </div>
            {(media as OpenverseVideoMedia).duration && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {formatDuration((media as OpenverseVideoMedia).duration || 0)}
              </div>
            )}
          </AspectRatio>
        </div>
      )}
      
      {/* Media info overlay on hover */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4 text-white transition-opacity"
      >
        <div className="space-y-1">
          <h3 className="font-medium text-sm line-clamp-1">{media.title}</h3>
          <p className="text-xs text-white/70 line-clamp-1">By {media.creator}</p>
        </div>
      </motion.div>
      
      {/* Media type badge */}
      <div className="absolute top-2 left-2">
        <div className="glass-panel flex items-center space-x-1 rounded-full px-2 py-1 text-xs">
          {isImage && <Image className="h-3 w-3" />}
          {isAudio && <Music className="h-3 w-3" />}
          {isVideo && <Video className="h-3 w-3" />}
          <span className="sr-only">
            {isImage ? 'Image' : isAudio ? 'Audio' : isVideo ? 'Video' : 'Media'}
          </span>
        </div>
      </div>
      
      {/* Info button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-background/70 backdrop-blur-sm hover:bg-background/90 text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onClick(media);
            }}
          >
            <Info className="h-3.5 w-3.5" />
            <span className="sr-only">View details</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View details</p>
        </TooltipContent>
      </Tooltip>
    </motion.div>
  );
};

// Helper function to format duration in MM:SS format
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

export default MediaCard;
