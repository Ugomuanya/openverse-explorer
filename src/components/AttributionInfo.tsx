import React from 'react';
import { OpenverseMedia } from '@/types';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AttributionInfoProps {
  media: OpenverseMedia;
  className?: string;
  onCopy?: () => void;
  copied?: boolean;
}

const AttributionInfo: React.FC<AttributionInfoProps> = ({ 
  media, 
  className, 
  onCopy: externalCopyHandler, 
  copied: externalCopiedState 
}) => {
  const [internalCopied, setInternalCopied] = React.useState(false);
  
  const copied = externalCopiedState !== undefined ? externalCopiedState : internalCopied;
  
  const attributionText = React.useMemo(() => {
    let text = `"${media.title || 'Untitled'}" by ${media.creator || 'Unknown'} `;
    
    text += `is licensed under ${media.license || 'CC'} ${media.license_version || ''}.`;
    
    if (media.source) {
      text += ` Source: ${media.source}`;
    }
    
    return text;
  }, [media]);
  
  const handleCopy = () => {
    if (externalCopyHandler) {
      externalCopyHandler();
    } else {
      navigator.clipboard.writeText(attributionText);
      setInternalCopied(true);
      setTimeout(() => setInternalCopied(false), 2000);
    }
  };
  
  const renderAttribution = () => {
    return (
      <span>
        "{media.title || 'Untitled'}" by{' '}
        <a 
          href={media.creator_url || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {media.creator || 'Unknown'}
        </a>{' '}
        is licensed under{' '}
        <a 
          href={media.license_url || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {media.license || 'CC'} {media.license_version || ''}
        </a>
        {media.source && (
          <>
            . Source:{' '}
            <a 
              href={media.foreign_landing_url || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {media.source}
            </a>
          </>
        )}
      </span>
    );
  };
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <h3 className="font-medium text-sm">How to attribute</h3>
        <div className="glass-panel p-4 rounded-lg text-sm">
          {renderAttribution()}
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1.5"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span>{copied ? 'Copied!' : 'Copy attribution'}</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => window.open(media.foreign_landing_url, '_blank')}
        >
          <ExternalLink className="h-4 w-4" />
          <span>View source</span>
        </Button>
      </div>
    </div>
  );
};

export default AttributionInfo;
