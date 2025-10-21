import { useState, useEffect, useRef } from 'react';
import { Send, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import MessageBubble from './MessageBubble';
import VoiceRecorder from './VoiceRecorder';
import ImageUpload from './ImageUpload';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender_id: string;
  content: string | null;
  message_type: 'text' | 'voice' | 'image';
  media_url: string | null;
  created_at: string;
  sender_name?: string;
}

interface ChatInterfaceProps {
  currentUserId: string;
  currentUserName: string;
  onLogout: () => void;
}

const ChatInterface = ({ currentUserId, currentUserName, onLogout }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [users, setUsers] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchUsers();
    fetchMessages();
    subscribeToMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchUsers = async () => {
    const { data } = await supabase.from('users').select('id, display_name');
    if (data) {
      const userMap = data.reduce((acc, user) => {
        acc[user.id] = user.display_name;
        return acc;
      }, {} as Record<string, string>);
      setUsers(userMap);
    }
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      toast.error('Failed to load messages');
      return;
    }

    setMessages((data || []) as Message[]);
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const sendMessage = async (content?: string, messageType: 'text' | 'voice' | 'image' = 'text', mediaUrl?: string) => {
    if ((!content && !mediaUrl) || isLoading) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.from('messages').insert({
        sender_id: currentUserId,
        content: content || null,
        message_type: messageType,
        media_url: mediaUrl || null
      });

      if (error) throw error;

      if (messageType === 'text') {
        setNewMessage('');
      }
    } catch (error) {
      console.error('Send message error:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(newMessage);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-card">
      {/* Header */}
      <div className="bg-card/50 backdrop-blur border-b border-border/50 p-4 flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {currentUserName === 'Ansh' ? 'Noahh' : 'Ansh'}
          </h1>
          <p className="text-xs text-muted-foreground">Online</p>
        </div>
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={onLogout}
          className="rounded-full"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            content={message.content || undefined}
            messageType={message.message_type}
            mediaUrl={message.media_url || undefined}
            isOwn={message.sender_id === currentUserId}
            senderName={users[message.sender_id] || 'Unknown'}
            timestamp={message.created_at}
          />
        ))}
      </ScrollArea>

      {/* Input Area */}
      <div className="bg-card/50 backdrop-blur border-t border-border/50 p-4">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <ImageUpload onImageUploaded={(url) => sendMessage(undefined, 'image', url)} />
          <VoiceRecorder onRecordingComplete={(url) => sendMessage(undefined, 'voice', url)} />
          
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={isLoading}
            className="flex-1"
          />
          
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !newMessage.trim()}
            className="rounded-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
