
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { OpenverseMedia, OpenverseImageMedia, OpenverseAudioMedia } from '@/types';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, Download, Calendar, Tag, Info, X } from 'lucide-react';
import AttributionInfo from './AttributionInfo';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface MediaDetailProps {
  media: OpenverseMedia | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MediaDetail: React.FC<MediaDetailProps> = ({ media, open, onOpenChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  
  const isImage = media && 'width' in media && 'height' in media;
  const isAudio = media && ('audio_set' in media || 'duration' in media);
  
  const handlePlayToggle = () => {
    if (!audioRef && isAudio && media) {
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
  
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const handleClose = () => {
    if (audioRef && isPlaying) {
      audioRef.pause();
      setIsPlaying(false);
    }
    onOpenChange(false);
  };
  
  if (!media) return null;
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader className="flex flex-row items-start justify-between">
          <div>
            <DialogTitle className="text-xl pr-10">{media.title || 'Untitled media'}</DialogTitle>
            <DialogDescription>By {media.creator || 'Unknown creator'}</DialogDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full" 
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        
        <div className="grid gap-6 sm:grid-cols-12 py-4">
          {/* Media preview */}
          <div className={cn("sm:col-span-8", isAudio ? "sm:col-span-12" : "")}>
            {isImage && (
              <div className="overflow-hidden rounded-lg border border-border/50 bg-black/5 shadow-sm">
                <AspectRatio ratio={16/9} className="relative">
                  {!loaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
                      <div className="h-16 w-16 rounded-full bg-muted-foreground/20"></div>
                    </div>
                  )}
                  <img 
                    src={(media as OpenverseImageMedia).url} 
                    alt={(media as OpenverseImageMedia).title || 'Media'} 
                    className={`object-contain w-full h-full ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                    onLoad={() => setLoaded(true)}
                  />
                </AspectRatio>
              </div>
            )}
            
            {isAudio && (
              <div className="glass-panel rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-14 w-14 rounded-full" 
                      onClick={handlePlayToggle}
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                    
                    <div>
                      <h3 className="font-medium">{media.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDuration((media as OpenverseAudioMedia).duration)}
                      </p>
                    </div>
                  </div>
                  
                  {(media as OpenverseAudioMedia).waveform && (
                    <div className="flex-1 mx-4 h-12 overflow-hidden">
                      <img 
                        src={(media as OpenverseAudioMedia).waveform} 
                        alt="Audio waveform" 
                        className="w-full h-full object-cover opacity-70"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Media info */}
          <div className={cn("space-y-6", isAudio ? "sm:col-span-12" : "sm:col-span-4")}>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="attribution">Attribution</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" className="gap-1.5" asChild>
                      <a href={media.url} download target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </a>
                    </Button>
                    
                    <Button variant="outline" size="sm" className="gap-1.5" asChild>
                      <a href={media.foreign_landing_url} target="_blank" rel="noopener noreferrer">
                        <Info className="h-4 w-4" />
                        <span>Source</span>
                      </a>
                    </Button>
                  </div>
                  
                  <dl className="space-y-2 text-sm">
                    {media.description && (
                      <div>
                        <dt className="font-medium">Description</dt>
                        <dd className="text-muted-foreground mt-1">{media.description}</dd>
                      </div>
                    )}
                    
                    {media.date_created && (
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <dt className="sr-only">Date</dt>
                          <dd>{format(new Date(media.date_created), 'MMMM d, yyyy')}</dd>
                        </div>
                      </div>
                    )}
                    
                    {isImage && (
                      <div>
                        <dt className="font-medium">Dimensions</dt>
                        <dd className="text-muted-foreground mt-1">
                          {(media as OpenverseImageMedia).width} × {(media as OpenverseImageMedia).height} px
                        </dd>
                      </div>
                    )}
                    
                    {media.filetype && (
                      <div>
                        <dt className="font-medium">File Type</dt>
                        <dd className="text-muted-foreground mt-1 uppercase">{media.filetype}</dd>
                      </div>
                    )}
                    
                    {media.license && (
                      <div>
                        <dt className="font-medium">License</dt>
                        <dd className="text-muted-foreground mt-1">
                          <a 
                            href={media.license_url || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline text-primary"
                          >
                            {media.license} {media.license_version}
                          </a>
                        </dd>
                      </div>
                    )}
                    
                    {media.provider && (
                      <div>
                        <dt className="font-medium">Provider</dt>
                        <dd className="text-muted-foreground mt-1">{media.provider}</dd>
                      </div>
                    )}
                  </dl>
                  
                  {media.tags && media.tags.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium flex items-center gap-1">
                        <Tag className="h-3.5 w-3.5" />
                        <span>Tags</span>
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {media.tags.map((tag) => (
                          <div 
                            key={tag.name} 
                            className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                          >
                            {tag.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="attribution" className="pt-4">
                <AttributionInfo media={media} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaDetail;
