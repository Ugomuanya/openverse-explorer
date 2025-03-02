
import { toPng } from 'html-to-image';
import { toast } from "sonner";

export const captureScreenshot = async (
  elementId: string, 
  fileName: string = 'screenshot'
): Promise<string | null> => {
  try {
    const element = document.getElementById(elementId);
    
    if (!element) {
      toast.error(`Element with ID "${elementId}" not found`);
      return null;
    }
    
    // Create the screenshot as a PNG data URL
    const dataUrl = await toPng(element, { 
      quality: 0.95,
      backgroundColor: '#fff'
    });
    
    return dataUrl;
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    toast.error('Failed to capture screenshot');
    return null;
  }
};

export const downloadScreenshot = async (
  elementId: string, 
  fileName: string = 'openverse-explorer-screenshot'
): Promise<void> => {
  const dataUrl = await captureScreenshot(elementId);
  
  if (!dataUrl) return;
  
  // Create a temporary link and trigger download
  const link = document.createElement('a');
  link.download = `${fileName}.png`;
  link.href = dataUrl;
  link.click();
  
  toast.success('Screenshot saved');
};

export const copyScreenshotToClipboard = async (
  elementId: string
): Promise<void> => {
  const dataUrl = await captureScreenshot(elementId);
  
  if (!dataUrl) return;
  
  try {
    // Convert data URL to blob
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    
    // Copy to clipboard using Clipboard API
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);
    
    toast.success('Screenshot copied to clipboard');
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    toast.error('Failed to copy screenshot to clipboard');
  }
};
