
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, Copy, Download, X } from 'lucide-react';
import { downloadScreenshot, copyScreenshotToClipboard } from '@/utils/screenshotUtil';
import { motion } from 'framer-motion';

interface ScreenshotToolbarProps {
  visible: boolean;
  onToggle: () => void;
}

const ScreenshotToolbar: React.FC<ScreenshotToolbarProps> = ({ 
  visible, 
  onToggle 
}) => {
  const [targetId, setTargetId] = useState<string>('main-content');
  
  const handleCaptureSection = (sectionId: string) => {
    setTargetId(sectionId);
  };
  
  if (!visible) {
    return (
      <motion.button
        className="fixed bottom-6 left-6 z-50 bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:bg-primary/90"
        onClick={onToggle}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Camera size={20} />
        <span className="sr-only">Open Screenshot Tool</span>
      </motion.button>
    );
  }
  
  return (
    <motion.div 
      className="fixed bottom-6 left-6 z-50 bg-card border rounded-lg shadow-lg p-4 w-64"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold flex items-center">
          <Camera className="mr-2 h-4 w-4" />
          Screenshot Tool
        </h3>
        <Button variant="ghost" size="icon" onClick={onToggle} className="h-6 w-6">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      
      <div className="space-y-3 mb-4">
        <p className="text-xs text-muted-foreground">Capture key sections of the application for your storyboard documentation.</p>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline" 
            size="sm"
            className={targetId === 'main-content' ? 'border-primary' : ''}
            onClick={() => handleCaptureSection('main-content')}
          >
            Full Page
          </Button>
          <Button
            variant="outline" 
            size="sm"
            className={targetId === 'search-bar' ? 'border-primary' : ''}
            onClick={() => handleCaptureSection('search-bar')}
          >
            Search Bar
          </Button>
          <Button
            variant="outline" 
            size="sm"
            className={targetId === 'media-results' ? 'border-primary' : ''}
            onClick={() => handleCaptureSection('media-results')}
          >
            Results Grid
          </Button>
          <Button
            variant="outline" 
            size="sm"
            className={targetId === 'media-detail' ? 'border-primary' : ''}
            onClick={() => handleCaptureSection('media-detail')}
          >
            Detail View
          </Button>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          className="flex-1"
          onClick={() => downloadScreenshot(targetId)}
          size="sm"
        >
          <Download className="mr-2 h-4 w-4" />
          Save
        </Button>
        <Button 
          className="flex-1"
          variant="outline"
          onClick={() => copyScreenshotToClipboard(targetId)}
          size="sm"
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy
        </Button>
      </div>
    </motion.div>
  );
};

export default ScreenshotToolbar;
