import { useState } from 'react';
import { Play, Pause, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  content?: string;
  messageType: 'text' | 'voice' | 'image';
  mediaUrl?: string;
  isOwn: boolean;
  senderName: string;
  timestamp: string;
}

const MessageBubble = ({ content, messageType, mediaUrl, isOwn, senderName, timestamp }: MessageBubbleProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(() => messageType === 'voice' && mediaUrl ? new Audio(mediaUrl) : null);

  const togglePlayback = () => {
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={cn(
      "flex flex-col mb-4 animate-slide-up",
      isOwn ? "items-end" : "items-start"
    )}>
      <span className="text-xs text-muted-foreground mb-1 px-2">{senderName}</span>
      
      <div className={cn(
        "max-w-[80%] rounded-2xl p-4 shadow-lg",
        isOwn 
          ? "bg-gradient-to-br from-primary to-secondary text-primary-foreground" 
          : "bg-card border border-border/50"
      )}>
        {messageType === 'text' && (
          <p className="text-sm break-words">{content}</p>
        )}
        
        {messageType === 'voice' && mediaUrl && (
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              onClick={togglePlayback}
              className={cn(
                "rounded-full",
                isOwn ? "hover:bg-white/20" : "hover:bg-accent"
              )}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <div className="flex-1 flex items-center gap-1">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-1 rounded-full",
                    isOwn ? "bg-white/30" : "bg-muted"
                  )}
                  style={{ height: `${Math.random() * 20 + 10}px` }}
                />
              ))}
            </div>
          </div>
        )}
        
        {messageType === 'image' && mediaUrl && (
          <img 
            src={mediaUrl} 
            alt="Shared image" 
            className="rounded-lg max-w-full h-auto"
          />
        )}
      </div>
      
      <span className="text-xs text-muted-foreground mt-1 px-2">
        {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
};

export default MessageBubble;
