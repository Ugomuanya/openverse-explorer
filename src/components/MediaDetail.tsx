
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { OpenverseMedia, OpenverseImageMedia, OpenverseAudioMedia, OpenverseVideoMedia } from "@/types";
import AttributionInfo from "./AttributionInfo";
import { X, ExternalLink, Download, Copy, Check, Image, Music, Video } from "lucide-react";
import { toast } from "sonner";
import VideoPlayer from './VideoPlayer';

interface MediaDetailProps {
  media: OpenverseMedia | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MediaDetail: React.FC<MediaDetailProps> = ({ media, open, onOpenChange }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");
  
  if (!media) return null;
  
  // Improved type checking for media types
  const isImage = 'width' in media && 'height' in media;
  const isAudio = 'audio_set' in media || ('duration' in media && !('video_codec' in media));
  const isVideo = 'video_codec' in media || ('duration' in media && !isAudio);

  const handleCopyAttribution = () => {
    const attribution = `"${media.title}" by ${media.creator} is licensed under ${media.license} ${media.license_version}`;
    navigator.clipboard.writeText(attribution).then(() => {
      setCopied(true);
      toast.success("Attribution copied to clipboard");
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(media.url);
      const blob = await response.blob();
      const fileExtension = getFileExtension(media.url);
      
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${media.title.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
      
      toast.success("Download started");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download media");
    }
  };
  
  const getFileExtension = (url: string) => {
    const match = url.match(/\.([^.]+)$/);
    return match ? match[1].toLowerCase() : isImage ? 'jpg' : isAudio ? 'mp3' : isVideo ? 'mp4' : 'file';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] overflow-y-auto p-0">
        <div className="sticky top-0 z-10 flex justify-between items-center p-4 border-b bg-background">
          <DialogTitle className="text-xl">{media.title}</DialogTitle>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        
        <div className="p-0 sm:p-6 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="info">License & Attribution</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="flex flex-col space-y-4">
              <div className="border rounded-lg overflow-hidden bg-muted/30">
                {isImage && (
                  <AspectRatio ratio={16/9} className="bg-muted">
                    <img 
                      src={(media as OpenverseImageMedia).url} 
                      alt={(media as OpenverseImageMedia).title}
                      className="w-full h-full object-contain"
                    />
                  </AspectRatio>
                )}
                
                {isAudio && (
                  <div className="p-4">
                    <audio 
                      src={(media as OpenverseAudioMedia).url}
                      className="w-full"
                      controls
                    />
                    {(media as OpenverseAudioMedia).waveform && (
                      <div className="mt-4 rounded-lg overflow-hidden">
                        <img 
                          src={(media as OpenverseAudioMedia).waveform} 
                          alt="Audio waveform"
                          className="w-full" 
                        />
                      </div>
                    )}
                  </div>
                )}

                {isVideo && (
                  <VideoPlayer 
                    src={(media as OpenverseVideoMedia).url}
                    poster={media.thumbnail || (media as OpenverseVideoMedia).video_thumbnail}
                    title={media.title}
                  />
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  className="flex-1 gap-2" 
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2" 
                  asChild
                >
                  <a href={media.foreign_landing_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Visit Source
                  </a>
                </Button>
                
                <Button 
                  variant="secondary" 
                  className="flex-1 gap-2" 
                  onClick={handleCopyAttribution}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? "Copied" : "Copy Attribution"}
                </Button>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Creator</p>
                    <p>{media.creator}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Provider</p>
                    <p>{media.provider}</p>
                  </div>
                  
                  {isImage && (
                    <>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Dimensions</p>
                        <p>{(media as OpenverseImageMedia).width} × {(media as OpenverseImageMedia).height}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="flex items-center gap-1">
                          <Image className="h-4 w-4" />
                          Image
                        </p>
                      </div>
                    </>
                  )}
                  
                  {isAudio && (
                    <>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p>{formatDuration((media as OpenverseAudioMedia).duration || 0)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="flex items-center gap-1">
                          <Music className="h-4 w-4" />
                          Audio
                        </p>
                      </div>
                    </>
                  )}
                  
                  {isVideo && (
                    <>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p>{formatDuration((media as OpenverseVideoMedia).duration || 0)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Type</p>
                        <p className="flex items-center gap-1">
                          <Video className="h-4 w-4" />
                          Video
                        </p>
                      </div>
                      {(media as OpenverseVideoMedia).width && (media as OpenverseVideoMedia).height && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Dimensions</p>
                          <p>{(media as OpenverseVideoMedia).width} × {(media as OpenverseVideoMedia).height}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                {media.description && (
                  <div className="mt-4 space-y-1">
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="text-sm">{media.description}</p>
                  </div>
                )}
                
                {media.tags && media.tags.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-muted-foreground">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {media.tags.map((tag, index) => (
                        <div 
                          key={index}
                          className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-md"
                        >
                          {tag.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="info">
              <AttributionInfo media={media} onCopy={handleCopyAttribution} copied={copied} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper function to format duration in MM:SS format
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

export default MediaDetail;
