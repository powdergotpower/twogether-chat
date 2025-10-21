import { useState, useRef } from 'react';
import { Mic, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface VoiceRecorderProps {
  onRecordingComplete: (audioUrl: string) => void;
}

const VoiceRecorder = ({ onRecordingComplete }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const fileName = `voice-${Date.now()}.webm`;
        
        try {
          const { data, error } = await supabase.storage
            .from('chat-media')
            .upload(fileName, blob);

          if (error) throw error;

          const { data: urlData } = supabase.storage
            .from('chat-media')
            .getPublicUrl(data.path);

          onRecordingComplete(urlData.publicUrl);
          toast.success('Voice note recorded!');
        } catch (error) {
          console.error('Upload error:', error);
          toast.error('Failed to upload voice note');
        }

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.info('Recording started...');
    } catch (error) {
      console.error('Recording error:', error);
      toast.error('Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={isRecording ? stopRecording : startRecording}
      className={`rounded-full ${isRecording ? 'animate-pulse-glow bg-destructive/20' : ''}`}
    >
      {isRecording ? <Square className="w-5 h-5 text-destructive" /> : <Mic className="w-5 h-5" />}
    </Button>
  );
};

export default VoiceRecorder;
